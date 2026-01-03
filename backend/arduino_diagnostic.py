#!/usr/bin/env python3
"""
Arduino Diagnostic Tool
=======================
Run this to diagnose why your Arduino upload is failing.
"""

import subprocess
import sys
import os
from pathlib import Path

# Try to import serial
try:
    import serial
    import serial.tools.list_ports
except ImportError:
    print("Installing pyserial...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyserial", "-q"])
    import serial
    import serial.tools.list_ports


def main():
    print("=" * 60)
    print("       ARDUINO DIAGNOSTIC TOOL")
    print("=" * 60)
    print()

    # 1. Check serial ports
    print("1️⃣  CHECKING SERIAL PORTS...")
    print("-" * 40)
    
    ports = list(serial.tools.list_ports.comports())
    arduino_port = None
    
    for port in ports:
        is_arduino = False
        vid_pid = ""
        
        if port.vid and port.pid:
            vid_pid = f"VID:{port.vid:04X} PID:{port.pid:04X}"
            # Check for Arduino VID/PID
            if port.vid == 0x2341:  # Arduino
                is_arduino = True
            elif port.vid == 0x1A86:  # CH340 clone
                is_arduino = True
            elif port.vid == 0x0403:  # FTDI
                is_arduino = True
        
        status = "✓ ARDUINO" if is_arduino else ""
        print(f"   {port.device}: {port.description}")
        print(f"      {vid_pid} {status}")
        print(f"      Manufacturer: {port.manufacturer or 'Unknown'}")
        
        if is_arduino:
            arduino_port = port.device
        print()
    
    if not arduino_port:
        print("   ❌ No Arduino detected!")
        print("   Check USB connection and drivers.")
        return
    
    print(f"   ✓ Arduino found on {arduino_port}")
    print()

    # 2. Test port access
    print("2️⃣  TESTING PORT ACCESS...")
    print("-" * 40)
    
    try:
        ser = serial.Serial(arduino_port, 9600, timeout=1)
        print(f"   ✓ Port {arduino_port} opened successfully")
        
        # Try to communicate
        ser.write(b'\n')
        import time
        time.sleep(0.5)
        
        if ser.in_waiting:
            data = ser.read(ser.in_waiting)
            print(f"   ✓ Received data: {data[:50]}...")
        else:
            print(f"   ℹ No data received (normal for unprogrammed board)")
        
        ser.close()
        print(f"   ✓ Port closed successfully")
        
    except serial.SerialException as e:
        print(f"   ❌ PORT ERROR: {e}")
        print()
        print("   LIKELY CAUSES:")
        print("   • Arduino IDE Serial Monitor is open - CLOSE IT!")
        print("   • Another program is using the port")
        print("   • Driver issue")
        return
    
    print()

    # 3. Test arduino-cli
    print("3️⃣  TESTING ARDUINO-CLI...")
    print("-" * 40)
    
    cli_path = Path.home() / ".arduino-flash-agent" / "bin" / "arduino-cli.exe"
    if not cli_path.exists():
        cli_path = "arduino-cli"  # Try PATH
    
    try:
        result = subprocess.run(
            [str(cli_path), "version"],
            capture_output=True,
            timeout=10
        )
        if result.returncode == 0:
            version = result.stdout.decode().strip()
            print(f"   ✓ arduino-cli found: {version}")
        else:
            print(f"   ❌ arduino-cli error: {result.stderr.decode()}")
            return
    except FileNotFoundError:
        print("   ❌ arduino-cli not found!")
        return
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return
    
    print()

    # 4. Check board connection with arduino-cli
    print("4️⃣  DETECTING BOARD WITH ARDUINO-CLI...")
    print("-" * 40)
    
    try:
        result = subprocess.run(
            [str(cli_path), "board", "list"],
            capture_output=True,
            timeout=30
        )
        output = result.stdout.decode()
        print(output)
        
        if "No boards found" in output or arduino_port not in output:
            print("   ⚠️ Board not detected by arduino-cli!")
            print("   This might be a driver issue.")
    except Exception as e:
        print(f"   Error: {e}")
    
    print()

    # 5. Try a manual upload test with verbose output
    print("5️⃣  TESTING UPLOAD (VERBOSE)...")
    print("-" * 40)
    print("   Creating minimal test sketch...")
    
    # Create a minimal test sketch
    test_dir = Path.home() / ".arduino-flash-agent" / "test_sketch"
    test_dir.mkdir(parents=True, exist_ok=True)
    
    test_sketch = test_dir / "test_sketch.ino"
    test_sketch.write_text("""
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
""")
    
    print(f"   Sketch created at: {test_sketch}")
    print()
    print("   Compiling...")
    
    # Compile
    result = subprocess.run(
        [str(cli_path), "compile", "--fqbn", "arduino:avr:uno", str(test_dir)],
        capture_output=True,
        timeout=120
    )
    
    if result.returncode != 0:
        print(f"   ❌ Compile failed: {result.stderr.decode()}")
        return
    
    print("   ✓ Compilation successful!")
    print()
    print("   Uploading with VERBOSE output...")
    print("   (Watch for error messages)")
    print()
    print("=" * 60)
    
    # Upload with verbose
    result = subprocess.run(
        [str(cli_path), "upload", 
         "--fqbn", "arduino:avr:uno", 
         "--port", arduino_port,
         "-v",  # Verbose!
         str(test_dir)],
        capture_output=True,
        timeout=120
    )
    
    print("STDOUT:")
    print(result.stdout.decode())
    print()
    print("STDERR:")
    print(result.stderr.decode())
    print()
    
    if result.returncode == 0:
        print("=" * 60)
        print("   ✓ ✓ ✓ UPLOAD SUCCESSFUL! ✓ ✓ ✓")
        print("   Your Arduino LED should be blinking!")
        print("=" * 60)
    else:
        print("=" * 60)
        print("   ❌ UPLOAD FAILED")
        print("=" * 60)
        print()
        print("   TROUBLESHOOTING:")
        print("   1. Close Arduino IDE completely")
        print("   2. Unplug and replug the Arduino")
        print("   3. Press the RESET button on Arduino")
        print("   4. Try a different USB cable")
        print("   5. Try a different USB port")
        print()
        
        stderr = result.stderr.decode().lower()
        if "not responding" in stderr:
            print("   SPECIFIC ISSUE: Board not responding to avrdude")
            print("   • Your Arduino might need a bootloader reflash")
            print("   • Or try pressing RESET right when upload starts")
        elif "access" in stderr or "denied" in stderr:
            print("   SPECIFIC ISSUE: Port access denied")
            print("   • Close ALL programs that might use the serial port")
        elif "not found" in stderr:
            print("   SPECIFIC ISSUE: Port not found")
            print("   • Arduino was disconnected during upload")


if __name__ == "__main__":
    main()
    print()
    input("Press Enter to exit...")