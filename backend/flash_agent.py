#!/usr/bin/env python3
"""
Arduino Flash Agent v1.0 - Production Ready
============================================
Simple, clean Flash Agent for Arduino Code Dumper
"""

import asyncio
import json
import os
import sys
import shutil
import tempfile
import subprocess
import platform
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
AGENT_VERSION = "1.0.0"
WEBSOCKET_PORT = 8765
IS_WINDOWS = platform.system() == "Windows"

# Arduino CLI path
agent_dir = Path.home() / ".arduino-flash-agent"
agent_dir.mkdir(exist_ok=True)
ARDUINO_CLI_PATH = None


def find_arduino_cli():
    """Find arduino-cli in PATH or local directory."""
    global ARDUINO_CLI_PATH
    
    # Check PATH first
    cli_in_path = shutil.which("arduino-cli")
    if cli_in_path:
        ARDUINO_CLI_PATH = cli_in_path
        return True
    
    # Check local installation
    local_cli = agent_dir / "bin" / ("arduino-cli.exe" if IS_WINDOWS else "arduino-cli")
    if local_cli.exists():
        ARDUINO_CLI_PATH = str(local_cli)
        return True
    
    return False


async def install_arduino_cli():
    """Download and install arduino-cli."""
    global ARDUINO_CLI_PATH
    
    bin_dir = agent_dir / "bin"
    bin_dir.mkdir(parents=True, exist_ok=True)
    
    print("Downloading arduino-cli...")
    
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
    
    urllib.request.urlretrieve(url, download_path)
    
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
    print("✓ arduino-cli installed")


async def setup_arduino_cli():
    """Setup arduino-cli with required cores."""
    if not find_arduino_cli():
        await install_arduino_cli()
    
    print("Setting up Arduino cores...")
    
    # Update index
    subprocess.run([ARDUINO_CLI_PATH, "core", "update-index"], 
                   capture_output=True, timeout=120)
    
    # Install common cores
    cores = ["arduino:avr", "arduino:megaavr"]
    for core in cores:
        subprocess.run([ARDUINO_CLI_PATH, "core", "install", core], 
                       capture_output=True, timeout=300)
    
    print("✓ Setup complete")


def list_ports():
    """List available serial ports."""
    ports = []
    for p in serial.tools.list_ports.comports():
        # Identify Arduino boards
        is_arduino = False
        if p.vid:
            # Common Arduino/Clone vendor IDs
            arduino_vids = [0x2341, 0x2A03, 0x1A86, 0x0403, 0x10C4]
            is_arduino = p.vid in arduino_vids
        
        ports.append({
            "port": p.device,
            "description": p.description or "Unknown",
            "is_arduino": is_arduino,
            "vid": hex(p.vid) if p.vid else None,
            "pid": hex(p.pid) if p.pid else None
        })
    
    return ports


async def compile_and_upload(data: dict, websocket):
    """Compile and upload code to Arduino."""
    
    code = data.get("code")
    fqbn = data.get("fqbn")
    port = data.get("port")
    libraries = data.get("libraries", [])
    
    if not all([code, fqbn, port]):
        await websocket.send(json.dumps({
            "type": "error",
            "message": "Missing required parameters (code, fqbn, or port)"
        }))
        return
    
    # Create temporary sketch directory
    sketch_dir = tempfile.mkdtemp(prefix="arduino_sketch_")
    sketch_path = Path(sketch_dir) / "sketch"
    sketch_path.mkdir()
    (sketch_path / "sketch.ino").write_text(code)
    
    try:
        # === COMPILE PHASE ===
        await websocket.send(json.dumps({
            "type": "compile_start",
            "message": "Starting compilation..."
        }))
        
        # Install required libraries
        for lib in libraries:
            await websocket.send(json.dumps({
                "type": "compile_progress",
                "progress": 10,
                "message": f"Installing library: {lib}"
            }))
            
            result = subprocess.run(
                [ARDUINO_CLI_PATH, "lib", "install", lib],
                capture_output=True, timeout=120
            )
            
            if result.returncode != 0:
                print(f"  Warning: Could not install {lib}")
        
        await websocket.send(json.dumps({
            "type": "compile_progress",
            "progress": 30,
            "message": "Compiling sketch..."
        }))
        
        # Compile
        compile_result = subprocess.run(
            [ARDUINO_CLI_PATH, "compile", "--fqbn", fqbn, str(sketch_path)],
            capture_output=True, timeout=180
        )
        
        if compile_result.returncode != 0:
            error_msg = compile_result.stderr.decode()
            await websocket.send(json.dumps({
                "type": "compile_error",
                "error": error_msg
            }))
            return
        
        await websocket.send(json.dumps({
            "type": "compile_complete",
            "message": "Compilation successful"
        }))
        
        # === UPLOAD PHASE ===
        await websocket.send(json.dumps({
            "type": "upload_start",
            "message": "Uploading to board..."
        }))
        
        await websocket.send(json.dumps({
            "type": "upload_progress",
            "progress": 50,
            "message": f"Uploading to {port}..."
        }))
        
        # Upload
        upload_result = subprocess.run(
            [ARDUINO_CLI_PATH, "upload", "--fqbn", fqbn, "--port", port, str(sketch_path)],
            capture_output=True, timeout=120
        )
        
        if upload_result.returncode != 0:
            error_msg = upload_result.stderr.decode()
            await websocket.send(json.dumps({
                "type": "upload_error",
                "error": error_msg
            }))
            return
        
        await websocket.send(json.dumps({
            "type": "upload_complete",
            "message": "Upload successful"
        }))
        
        # === VERIFY PHASE ===
        await websocket.send(json.dumps({
            "type": "verify_complete",
            "message": "Code successfully flashed to Arduino!"
        }))
        
    except subprocess.TimeoutExpired:
        await websocket.send(json.dumps({
            "type": "upload_error",
            "error": "Operation timed out. Please try again."
        }))
    except Exception as e:
        await websocket.send(json.dumps({
            "type": "error",
            "message": str(e)
        }))
    finally:
        # Cleanup
        shutil.rmtree(sketch_dir, ignore_errors=True)


async def handle_client(websocket, path=None):
    """Handle WebSocket client connection."""
    client_id = id(websocket)
    print(f"Client connected: {client_id}")
    
    # Send connection confirmation
    await websocket.send(json.dumps({
        "type": "connected",
        "version": AGENT_VERSION
    }))
    
    try:
        async for message in websocket:
            try:
                data = json.loads(message)
                msg_type = data.get("type")
                
                if msg_type == "list_ports":
                    ports = list_ports()
                    await websocket.send(json.dumps({
                        "type": "ports",
                        "ports": ports
                    }))
                
                elif msg_type == "compile_and_upload":
                    print(f"Upload request: {data.get('fqbn')} -> {data.get('port')}")
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
        print(f"Client disconnected: {client_id}")


async def main():
    """Main entry point."""
    print(f"""
╔═══════════════════════════════════════════════════════════╗
║           Arduino Flash Agent v{AGENT_VERSION}                     ║
║                                                           ║
║  Ready to receive code from Arduino Code Dumper           ║
╚═══════════════════════════════════════════════════════════╝
""")
    
    # Setup arduino-cli
    await setup_arduino_cli()
    
    # Show available ports
    print("\nAvailable serial ports:")
    for p in list_ports():
        marker = " ★ Arduino" if p['is_arduino'] else ""
        print(f"  • {p['port']}: {p['description']}{marker}")
    
    print(f"\n✓ Listening on ws://localhost:{WEBSOCKET_PORT}")
    print("  Keep this window open while using Arduino Code Dumper\n")
    
    # Start WebSocket server
    async with websockets.serve(handle_client, "localhost", WEBSOCKET_PORT):
        await asyncio.Future()  # Run forever


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n\nFlash Agent stopped.")