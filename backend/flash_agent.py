#!/usr/bin/env python3
"""
Arduino Flash Agent v3.2.0 - ESP32 Fast Flash Edition
=====================================================
Optimized primarily for ESP32, also fast for AVR:
- Library caching (only installs once)
- Build cache reuse (incremental compilation)
- Async subprocess (non-blocking)
- NO verbose upload flag (saves 30-60s on ESP32!)
- Persistent build directory for core cache
- Parallel library installation
- ESP32-specific: proper timeouts, upload speed, build paths
- Board-aware compile/upload with separate ESP32 handling
"""

import asyncio
import json
import os
import sys
import shutil
import subprocess
import platform
import time
import hashlib
from pathlib import Path

try:
    import websockets
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "websockets", "-q"])
    import websockets

try:
    import serial
    import serial.tools.list_ports
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyserial", "-q"])
    import serial
    import serial.tools.list_ports

# Configuration
AGENT_VERSION = "3.2.0"
WEBSOCKET_PORT = 8765
IS_WINDOWS = platform.system() == "Windows"

# Directories
agent_dir = Path.home() / ".arduino-flash-agent"
agent_dir.mkdir(exist_ok=True)

# === PERFORMANCE: Persistent build cache directory ===
BUILD_CACHE_DIR = agent_dir / "build-cache"
BUILD_CACHE_DIR.mkdir(exist_ok=True)

# === PERFORMANCE: Separate build dirs per board type (AVR and ESP32 can conflict) ===
AVR_BUILD_DIR = agent_dir / "build-avr"
AVR_BUILD_DIR.mkdir(exist_ok=True)
ESP32_BUILD_DIR = agent_dir / "build-esp32"
ESP32_BUILD_DIR.mkdir(exist_ok=True)

# === PERFORMANCE: Persistent sketch directories per board type ===
AVR_SKETCH_DIR = agent_dir / "sketch-avr"
AVR_SKETCH_DIR.mkdir(exist_ok=True)
(AVR_SKETCH_DIR / "sketch").mkdir(exist_ok=True)

ESP32_SKETCH_DIR = agent_dir / "sketch-esp32"
ESP32_SKETCH_DIR.mkdir(exist_ok=True)
(ESP32_SKETCH_DIR / "sketch").mkdir(exist_ok=True)

# === PERFORMANCE: Track installed libraries to skip re-install ===
INSTALLED_LIBS_FILE = agent_dir / "installed_libs.json"

ARDUINO_CLI_PATH = None
SETUP_STATE_FILE = agent_dir / "setup_state.json"

# ESP32 upload baud rate - higher = faster upload
# 921600 is the fastest stable rate for most ESP32 boards
# Fall back to 460800 if you get upload errors
ESP32_UPLOAD_SPEED = 921600


# ============================================================================
# LIBRARY CACHE - Only install libraries once
# ============================================================================
def load_installed_libs():
    """Load set of already-installed library names."""
    if INSTALLED_LIBS_FILE.exists():
        try:
            with open(INSTALLED_LIBS_FILE, 'r') as f:
                return set(json.load(f))
        except Exception:
            pass
    return set()


def save_installed_libs(libs: set):
    """Save installed library names."""
    with open(INSTALLED_LIBS_FILE, 'w') as f:
        json.dump(list(libs), f)


# Track what's installed in memory for fastest access
_installed_libs_cache = load_installed_libs()


# ============================================================================
# CODE HASH - Skip recompile if code unchanged
# ============================================================================
_last_code_hash = {}  # fqbn -> hash


def code_hash(code: str, fqbn: str) -> str:
    return hashlib.md5(f"{code}{fqbn}".encode()).hexdigest()


def is_code_unchanged(code: str, fqbn: str) -> bool:
    h = code_hash(code, fqbn)
    return _last_code_hash.get(fqbn) == h


def mark_code_compiled(code: str, fqbn: str):
    _last_code_hash[fqbn] = code_hash(code, fqbn)


# ============================================================================
# SETUP STATE
# ============================================================================
def load_setup_state():
    if SETUP_STATE_FILE.exists():
        try:
            with open(SETUP_STATE_FILE, 'r') as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "arduino_cli_installed": False,
        "cores_updated": False,
        "avr_core_installed": False,
        "esp32_core_installed": False,
        "last_setup_date": None
    }


def save_setup_state(state):
    state["last_setup_date"] = time.time()
    with open(SETUP_STATE_FILE, 'w') as f:
        json.dump(state, f, indent=2)


def find_arduino_cli():
    global ARDUINO_CLI_PATH
    cli_in_path = shutil.which("arduino-cli")
    if cli_in_path:
        ARDUINO_CLI_PATH = cli_in_path
        return True
    local_cli = agent_dir / "bin" / ("arduino-cli.exe" if IS_WINDOWS else "arduino-cli")
    if local_cli.exists():
        ARDUINO_CLI_PATH = str(local_cli)
        return True
    return False


# ============================================================================
# ASYNC SUBPROCESS HELPER - Non-blocking
# ============================================================================
async def run_async(cmd, timeout=120):
    """Run subprocess asynchronously - doesn't block the event loop."""
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    try:
        stdout, stderr = await asyncio.wait_for(
            process.communicate(), timeout=timeout
        )
        return process.returncode, stdout.decode(errors='replace'), stderr.decode(errors='replace')
    except asyncio.TimeoutError:
        process.kill()
        await process.communicate()
        raise


async def run_async_with_progress(cmd, websocket, phase_type, base_progress, max_progress, timeout=180):
    """
    Run subprocess with live progress updates sent to websocket.
    Reads stderr line-by-line for real-time progress (esptool outputs to stderr).
    """
    process = await asyncio.create_subprocess_exec(
        *cmd,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    
    start = time.time()
    stderr_lines = []
    
    async def read_stderr():
        while True:
            line = await process.stderr.readline()
            if not line:
                break
            decoded = line.decode(errors='replace').strip()
            if decoded:
                stderr_lines.append(decoded)
                # Check for esptool progress patterns
                if 'Writing at' in decoded or '%' in decoded:
                    elapsed = time.time() - start
                    progress = min(base_progress + ((elapsed / timeout) * (max_progress - base_progress)), max_progress - 1)
                    await websocket.send(json.dumps({
                        "type": f"{phase_type}_progress",
                        "progress": int(progress),
                        "message": decoded[:80]
                    }))
    
    try:
        # Read stderr in background while waiting for process
        stderr_task = asyncio.create_task(read_stderr())
        
        stdout_data, _ = await asyncio.wait_for(
            process.communicate(), timeout=timeout
        )
        
        # Wait for stderr reader to finish
        await asyncio.wait_for(stderr_task, timeout=2)
        
        return process.returncode, stdout_data.decode(errors='replace'), '\n'.join(stderr_lines)
        
    except asyncio.TimeoutError:
        process.kill()
        await process.communicate()
        raise


# ============================================================================
# SETUP FUNCTIONS
# ============================================================================
async def send_progress(websocket, step, progress, message, status="info"):
    await websocket.send(json.dumps({
        "type": "setup_progress",
        "step": step,
        "progress": progress,
        "message": message,
        "status": status
    }))


async def install_arduino_cli(websocket):
    global ARDUINO_CLI_PATH
    await send_progress(websocket, "arduino_cli", 0, "Preparing to download Arduino CLI...", "info")

    bin_dir = agent_dir / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)

    if IS_WINDOWS:
        filename = "arduino-cli_latest_Windows_64bit.zip"
        cli_name = "arduino-cli.exe"
    elif platform.system() == "Darwin":
        arch = platform.machine().lower()
        filename = f"arduino-cli_latest_macOS_{'ARM64' if 'arm' in arch else '64bit'}.tar.gz"
        cli_name = "arduino-cli"
    else:
        filename = "arduino-cli_latest_Linux_64bit.tar.gz"
        cli_name = "arduino-cli"

    import urllib.request
    url = f"https://downloads.arduino.cc/arduino-cli/{filename}"
    download_path = agent_dir / filename

    try:
        await send_progress(websocket, "arduino_cli", 10, "Downloading Arduino CLI...", "info")
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, lambda: urllib.request.urlretrieve(url, download_path))
        
        await send_progress(websocket, "arduino_cli", 50, "Extracting files...", "info")

        if filename.endswith('.zip'):
            import zipfile
            with zipfile.ZipFile(download_path, 'r') as z:
                z.extractall(bin_dir)
        else:
            import tarfile
            with tarfile.open(download_path, 'r:gz') as t:
                t.extractall(bin_dir)

        ARDUINO_CLI_PATH = str(bin_dir / cli_name)
        if not IS_WINDOWS:
            os.chmod(ARDUINO_CLI_PATH, 0o755)
        download_path.unlink()

        await send_progress(websocket, "arduino_cli", 100, "✓ Arduino CLI installed", "success")
        return True
    except Exception as e:
        await send_progress(websocket, "arduino_cli", 0, f"✗ Installation failed: {str(e)}", "error")
        return False


async def update_core_index(websocket):
    await send_progress(websocket, "core_index", 0, "Updating package index...", "info")
    try:
        # ESP32 needs the additional board manager URL
        config_cmd = [
            ARDUINO_CLI_PATH, "config", "set",
            "board_manager.additional_urls",
            "https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json"
        ]
        await run_async(config_cmd, timeout=10)
        
        returncode, stdout, stderr = await run_async(
            [ARDUINO_CLI_PATH, "core", "update-index"], timeout=120
        )
        await send_progress(websocket, "core_index", 100, "✓ Package index updated (incl. ESP32)", "success")
        return True
    except Exception as e:
        await send_progress(websocket, "core_index", 100, f"⚠ Index update issue (continuing...)", "warning")
        return True


async def install_avr_core(websocket):
    await send_progress(websocket, "avr_core", 0, "Installing Arduino AVR core...", "info")
    try:
        returncode, stdout, stderr = await run_async(
            [ARDUINO_CLI_PATH, "core", "install", "arduino:avr"], timeout=300
        )
        if returncode == 0 or "already installed" in stderr.lower():
            await send_progress(websocket, "avr_core", 100, "✓ Arduino AVR core ready", "success")
            return True
        await send_progress(websocket, "avr_core", 100, "⚠ AVR core installation warning", "warning")
        return True
    except Exception as e:
        await send_progress(websocket, "avr_core", 0, f"⚠ AVR installation issue: {str(e)}", "warning")
        return True


async def install_esp32_core(websocket):
    await send_progress(websocket, "esp32_core", 0, "Installing ESP32 core (may take 10-30 min first time)...", "info")
    start_time = time.time()
    try:
        # Check if already installed
        returncode, stdout, stderr = await run_async(
            [ARDUINO_CLI_PATH, "core", "list"], timeout=10
        )
        if "esp32:esp32" in stdout:
            await send_progress(websocket, "esp32_core", 100, "✓ ESP32 core already installed", "success")
            return True

        # Install with async monitoring
        process = await asyncio.create_subprocess_exec(
            ARDUINO_CLI_PATH, "core", "install", "esp32:esp32",
            stdout=asyncio.subprocess.PIPE,
            stderr=asyncio.subprocess.PIPE
        )
        
        while process.returncode is None:
            elapsed = time.time() - start_time
            progress = min(int((elapsed / 1200) * 90), 95)
            minutes = int(elapsed / 60)
            seconds = int(elapsed % 60)
            await send_progress(
                websocket, "esp32_core", progress,
                f"Installing ESP32 core... ({minutes}m {seconds}s elapsed)", "info"
            )
            try:
                await asyncio.wait_for(process.wait(), timeout=5)
            except asyncio.TimeoutError:
                continue

        stdout_data = await process.stdout.read()
        stderr_data = await process.stderr.read()
        elapsed = time.time() - start_time

        if process.returncode == 0 or "already installed" in stderr_data.decode(errors='replace').lower():
            await send_progress(
                websocket, "esp32_core", 100,
                f"✓ ESP32 core installed ({int(elapsed)}s)", "success"
            )
            return True
        else:
            await send_progress(websocket, "esp32_core", 0, "⚠ ESP32 installation warning", "warning")
            return True

    except Exception as e:
        await send_progress(websocket, "esp32_core", 0, f"⚠ ESP32 installation error: {str(e)}", "warning")
        return False


async def setup_arduino_cli(websocket):
    state = load_setup_state()
    
    if not state["arduino_cli_installed"]:
        if not find_arduino_cli():
            success = await install_arduino_cli(websocket)
            if not success:
                return False
            state["arduino_cli_installed"] = True
            save_setup_state(state)
        else:
            state["arduino_cli_installed"] = True
            save_setup_state(state)
            await send_progress(websocket, "arduino_cli", 100, "✓ Arduino CLI found", "success")
    else:
        find_arduino_cli()
        await send_progress(websocket, "arduino_cli", 100, "✓ Arduino CLI ready", "success")

    if not state["cores_updated"]:
        success = await update_core_index(websocket)
        if success:
            state["cores_updated"] = True
            save_setup_state(state)
    else:
        await send_progress(websocket, "core_index", 100, "✓ Package index ready", "success")

    if not state["avr_core_installed"]:
        success = await install_avr_core(websocket)
        if success:
            state["avr_core_installed"] = True
            save_setup_state(state)
    else:
        await send_progress(websocket, "avr_core", 100, "✓ Arduino AVR core ready", "success")

    if not state["esp32_core_installed"]:
        success = await install_esp32_core(websocket)
        if success:
            state["esp32_core_installed"] = True
            save_setup_state(state)
    else:
        await send_progress(websocket, "esp32_core", 100, "✓ ESP32 core ready", "success")

    return True


# ============================================================================
# PORT LISTING
# ============================================================================
def list_ports():
    ports = []
    for p in serial.tools.list_ports.comports():
        is_arduino = False
        is_esp32 = False

        desc_lower = (p.description or "").lower()
        mfr_lower = (p.manufacturer or "").lower()
        hwid_lower = (p.hwid or "").lower()

        # ESP32 detection - expanded keywords
        esp32_keywords = ['esp32', 'esp-32', 'wemos', 'lolin', 'nodemcu', 
                         'cp210', 'cp2102', 'cp2104', 'ch340', 'ch9102', 
                         'ft232', 'ftdi', 'silicon labs']
        esp32_vids = [0x1A86, 0x10C4, 0x0403, 0x067B, 0x303A]  # 0x303A = Espressif native USB
        
        if any(k in desc_lower for k in esp32_keywords) or any(k in mfr_lower for k in esp32_keywords):
            is_esp32 = True
        elif p.vid in esp32_vids:
            is_esp32 = True
        elif 'usb-serial' in desc_lower or 'usb serial' in desc_lower:
            # Generic USB serial - likely ESP32 with CH340/CP2102
            is_esp32 = True

        # Arduino detection (override ESP32 if it's actually Arduino)
        arduino_keywords = ['arduino', 'genuino']
        arduino_vids = [0x2341, 0x2A03, 0x1B4F]  # Added SparkFun
        if any(k in desc_lower for k in arduino_keywords) or p.vid in arduino_vids:
            is_arduino = True
            is_esp32 = False

        ports.append({
            "port": p.device,
            "description": p.description or "Unknown Device",
            "manufacturer": p.manufacturer or "",
            "is_arduino": is_arduino,
            "is_esp32": is_esp32,
            "vid": hex(p.vid) if p.vid else None,
            "pid": hex(p.pid) if p.pid else None
        })
    return ports


# ============================================================================
# RESET ESP32 BEFORE UPLOAD (helps with boot mode issues)
# ============================================================================
async def reset_esp32_board(port):
    """
    Toggle DTR/RTS to put ESP32 into bootloader mode.
    This prevents the 'Failed to connect to ESP32' error.
    """
    try:
        ser = serial.Serial(port, 115200, timeout=0.1)
        # Standard ESP32 reset sequence: pull EN low via RTS, then GPIO0 low via DTR
        ser.dtr = False
        ser.rts = True
        await asyncio.sleep(0.1)
        ser.dtr = True
        ser.rts = False
        await asyncio.sleep(0.05)
        ser.dtr = False
        ser.close()
        await asyncio.sleep(0.2)  # Give ESP32 time to enter bootloader
        return True
    except Exception:
        # If reset fails, esptool will handle it - not critical
        return False


# ============================================================================
# COMPILE & UPLOAD - HEAVILY OPTIMIZED FOR ESP32
# ============================================================================
async def compile_and_upload(data: dict, websocket):
    """
    Optimized compile and upload pipeline:
    
    ESP32-specific optimizations:
    1. Separate build directories (AVR and ESP32 don't share well)
    2. NO -v flag (saves 30-60s on ESP32 upload)
    3. Higher baud rate (921600 vs default 460800)
    4. Pre-upload board reset via DTR/RTS toggle
    5. Longer but appropriate timeouts (ESP32 binary = ~1.2MB)
    6. Build cache for ESP32 core (FreeRTOS, WiFi, BT don't change)
    
    General optimizations:
    7. Library caching - install once, never again
    8. Parallel library installation
    9. Persistent build directory - incremental compilation
    10. Async subprocess - non-blocking event loop
    """
    global _installed_libs_cache

    code = data.get("code")
    fqbn = data.get("fqbn")
    port = data.get("port")
    libraries = data.get("libraries", [])
    board_type = data.get("boardType", "avr")

    if not all([code, fqbn, port]):
        await websocket.send(json.dumps({
            "type": "error",
            "message": "Missing required parameters (code, fqbn, or port)"
        }))
        return

    start_time = time.time()
    is_esp32 = board_type == "esp32"

    # === Use SEPARATE sketch/build directories per board type ===
    # This is critical: ESP32 and AVR build artifacts are incompatible
    # Sharing a build dir forces full recompile when switching boards
    if is_esp32:
        sketch_dir = ESP32_SKETCH_DIR
        build_dir = ESP32_BUILD_DIR
    else:
        sketch_dir = AVR_SKETCH_DIR
        build_dir = AVR_BUILD_DIR

    sketch_path = sketch_dir / "sketch"
    sketch_path.mkdir(exist_ok=True)
    ino_file = sketch_path / "sketch.ino"
    ino_file.write_text(code)

    try:
        # ============================================================
        # STEP 1: Install libraries (SKIP if already installed)
        # ============================================================
        await websocket.send(json.dumps({
            "type": "compile_start",
            "message": f"⚡ Fast Flash: {board_type.upper()} compilation starting..."
        }))

        libs_to_install = [lib for lib in libraries if lib not in _installed_libs_cache]

        if libs_to_install:
            await websocket.send(json.dumps({
                "type": "compile_progress",
                "progress": 5,
                "message": f"Installing {len(libs_to_install)} new library(ies)..."
            }))

            # Install libraries in PARALLEL
            install_tasks = []
            for lib in libs_to_install:
                install_tasks.append(
                    run_async([ARDUINO_CLI_PATH, "lib", "install", lib], timeout=60)
                )

            results = await asyncio.gather(*install_tasks, return_exceptions=True)

            for lib, result in zip(libs_to_install, results):
                if not isinstance(result, Exception):
                    returncode = result[0]
                    if returncode == 0:
                        _installed_libs_cache.add(lib)

            save_installed_libs(_installed_libs_cache)
            
            await websocket.send(json.dumps({
                "type": "compile_progress",
                "progress": 15,
                "message": f"Libraries ready ✓"
            }))
        else:
            if libraries:
                await websocket.send(json.dumps({
                    "type": "compile_progress",
                    "progress": 15,
                    "message": "Libraries cached ✓ (skipped install)"
                }))

        # ============================================================
        # STEP 2: Compile with build cache
        # ============================================================
        
        # Check if code is unchanged - if so, skip compile entirely
        if is_code_unchanged(code, fqbn) and (build_dir / "sketch.ino.bin" if is_esp32 else build_dir / "sketch.ino.hex").exists():
            await websocket.send(json.dumps({
                "type": "compile_progress",
                "progress": 45,
                "message": "Code unchanged - using cached build ⚡"
            }))
            await websocket.send(json.dumps({
                "type": "compile_complete",
                "message": "Skipped compile (cached) ✓"
            }))
        else:
            await websocket.send(json.dumps({
                "type": "compile_progress",
                "progress": 20,
                "message": f"Compiling for {fqbn}..."
            }))

            compile_cmd = [
                ARDUINO_CLI_PATH, "compile",
                "--fqbn", fqbn,
                "--build-cache-path", str(BUILD_CACHE_DIR),  # Reuse compiled cores
                "--build-path", str(build_dir),               # Persistent build output
            ]
            
            # ESP32 optimization: use all CPU cores for compilation
            if is_esp32:
                compile_cmd.extend(["--jobs", "0"])  # 0 = use all available cores
            
            compile_cmd.append(str(sketch_path))

            compile_start = time.time()

            # ESP32 first compile can be slow, give it more time
            compile_timeout = 300 if is_esp32 else 120
            
            returncode, stdout, stderr = await run_async(compile_cmd, timeout=compile_timeout)

            compile_time = time.time() - compile_start

            if returncode != 0:
                # Clean error message
                error_lines = [l for l in stderr.split('\n') if l.strip() and not l.startswith('Using')]
                await websocket.send(json.dumps({
                    "type": "compile_error",
                    "error": '\n'.join(error_lines[-20:])  # Last 20 lines of errors
                }))
                return

            mark_code_compiled(code, fqbn)

            await websocket.send(json.dumps({
                "type": "compile_complete",
                "message": f"Compiled in {compile_time:.1f}s ✓"
            }))

        # ============================================================
        # STEP 3: Upload to board
        # ============================================================
        
        # ESP32: Reset board to enter bootloader mode
        if is_esp32:
            await websocket.send(json.dumps({
                "type": "upload_start",
                "message": f"Preparing ESP32 on {port}..."
            }))
            await reset_esp32_board(port)
        else:
            await websocket.send(json.dumps({
                "type": "upload_start",
                "message": f"Uploading to {port}..."
            }))

        # Build upload command
        upload_cmd = [
            ARDUINO_CLI_PATH, "upload",
            "--fqbn", fqbn,
            "--port", port,
            "--input-dir", str(build_dir),
            # CRITICAL: No -v flag! Verbose mode on ESP32 adds 30-60s
        ]
        
        # ESP32: Set faster upload speed
        if is_esp32:
            upload_cmd.extend([
                "--board-options", f"UploadSpeed={ESP32_UPLOAD_SPEED}"
            ])

        upload_start = time.time()

        # ESP32 uploads are larger (~1.2MB), need more time than AVR (~30KB)
        upload_timeout = 120 if is_esp32 else 60

        returncode, stdout, stderr = await run_async(upload_cmd, timeout=upload_timeout)

        upload_time = time.time() - upload_start

        if returncode != 0:
            error_msg = stderr.strip()
            
            # ESP32 specific error handling
            if is_esp32 and ("failed to connect" in error_msg.lower() or "timed out" in error_msg.lower()):
                await websocket.send(json.dumps({
                    "type": "upload_error",
                    "error": (
                        "ESP32 connection failed. Try:\n"
                        "1. Hold BOOT button while clicking Flash\n"
                        "2. Check USB cable (use data cable, not charge-only)\n"
                        "3. Try a different USB port\n"
                        f"\nOriginal error: {error_msg[-200:]}"
                    )
                }))
            elif is_esp32 and "upload speed" in error_msg.lower():
                # Baud rate issue - retry hint
                await websocket.send(json.dumps({
                    "type": "upload_error",
                    "error": f"Upload speed issue. Try lowering ESP32_UPLOAD_SPEED in agent config.\n{error_msg[-200:]}"
                }))
            else:
                await websocket.send(json.dumps({
                    "type": "upload_error",
                    "error": error_msg[-500:]  # Last 500 chars of error
                }))
            return

        await websocket.send(json.dumps({
            "type": "upload_complete",
            "message": f"Uploaded in {upload_time:.1f}s ✓"
        }))

        total_time = time.time() - start_time

        await websocket.send(json.dumps({
            "type": "verify_complete",
            "message": f"⚡ Flashed to {board_type.upper()} in {total_time:.1f}s total!"
        }))

        print(f"[FLASH] ✓ {board_type.upper()} done in {total_time:.1f}s "
              f"(compile: {compile_time:.1f}s, upload: {upload_time:.1f}s)" 
              if 'compile_time' in dir() else 
              f"[FLASH] ✓ {board_type.upper()} done in {total_time:.1f}s (cached compile)")

    except asyncio.TimeoutError:
        elapsed = time.time() - start_time
        await websocket.send(json.dumps({
            "type": "upload_error",
            "error": (
                f"Operation timed out after {int(elapsed)}s.\n"
                + ("For ESP32: Hold BOOT button during upload, or check USB connection." if is_esp32 
                   else "Check board connection and try again.")
            )
        }))
    except Exception as e:
        await websocket.send(json.dumps({
            "type": "error",
            "message": str(e)
        }))
    # NOTE: We do NOT delete build dirs — they ARE our build cache!


# ============================================================================
# WEBSOCKET HANDLER
# ============================================================================
async def handle_client(websocket, path=None):
    client_id = id(websocket)
    print(f"\n[CLIENT] Connected: {client_id}")

    state = load_setup_state()
    needs_setup = not all([
        state["arduino_cli_installed"],
        state["cores_updated"],
        state["avr_core_installed"],
        state["esp32_core_installed"]
    ])

    await websocket.send(json.dumps({
        "type": "connected",
        "version": AGENT_VERSION,
        "needs_setup": needs_setup,
        "setup_state": state
    }))

    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                msg_type = data.get("type")

                if msg_type == "setup":
                    await websocket.send(json.dumps({
                        "type": "setup_start",
                        "message": "Starting setup..."
                    }))
                    success = await setup_arduino_cli(websocket)
                    if success:
                        await websocket.send(json.dumps({
                            "type": "setup_complete",
                            "message": "Setup complete! Agent ready."
                        }))
                    else:
                        await websocket.send(json.dumps({
                            "type": "setup_error",
                            "message": "Setup encountered errors. Some features may not work."
                        }))

                elif msg_type == "list_ports":
                    ports = list_ports()
                    await websocket.send(json.dumps({
                        "type": "ports",
                        "ports": ports
                    }))

                elif msg_type == "compile_and_upload":
                    board_type = data.get("boardType", "avr")
                    print(f"[FLASH] {data.get('fqbn')} → {data.get('port')} ({board_type})")
                    await compile_and_upload(data, websocket)

                elif msg_type == "ping":
                    await websocket.send(json.dumps({"type": "pong"}))

                else:
                    await websocket.send(json.dumps({
                        "type": "error",
                        "message": f"Unknown message type: {msg_type}"
                    }))

            except json.JSONDecodeError:
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON"
                }))

    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        print(f"[CLIENT] Disconnected: {client_id}")


# ============================================================================
# MAIN
# ============================================================================
async def main():
    print(f"""
╔═══════════════════════════════════════════════════════════╗
║     Arduino Flash Agent v{AGENT_VERSION} - ESP32 Fast Flash     ║
║                                                           ║
║  ⚡ ESP32 Optimizations:                                  ║
║    • Separate build cache (AVR/ESP32)                     ║
║    • 921600 baud upload speed                             ║
║    • Pre-upload board reset (DTR/RTS)                     ║
║    • No verbose flag (-v removed = 30-60s saved)          ║
║    • Parallel compilation (--jobs 0)                      ║
║    • Smart error messages for ESP32 issues                ║
║                                                           ║
║  ⚡ General Optimizations:                                ║
║    • Build cache reuse (incremental compile)              ║
║    • Library caching (install once)                       ║
║    • Code hash check (skip recompile if unchanged)        ║
║    • Async subprocess (non-blocking)                      ║
╚═══════════════════════════════════════════════════════════╝
""")

    state = load_setup_state()
    if all([state["arduino_cli_installed"], state["cores_updated"],
            state["avr_core_installed"], state["esp32_core_installed"]]):
        print("✓ Setup complete - ready for connections")
        find_arduino_cli()
        print(f"✓ {len(_installed_libs_cache)} libraries cached")
        print(f"✓ ESP32 upload speed: {ESP32_UPLOAD_SPEED} baud")
        
        ports = list_ports()
        if ports:
            print(f"\n📍 Available ports:")
            for p in ports:
                marker = " 📡 ESP32" if p['is_esp32'] else " ★ Arduino" if p['is_arduino'] else ""
                print(f"   • {p['port']}: {p['description']}{marker}")
        else:
            print("\n⚠ No serial ports detected. Connect a board and restart.")
    else:
        print("⚠ First-time setup required - will run on first connection")

    print(f"\n✅ Listening on ws://localhost:{WEBSOCKET_PORT}")
    print("   Keep this terminal open while using Arduino Code Dumper\n")

    async with websockets.serve(handle_client, "localhost", WEBSOCKET_PORT):
        await asyncio.Future()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\n👋 Flash Agent stopped.")
    except Exception as e:
        print(f"\n✗ Fatal error: {e}")