#!/usr/bin/env python3
"""
Simple Arduino Test - Tests if your Arduino can be programmed
"""

import subprocess
import sys
from pathlib import Path

# Install pyserial if needed
try:
    import serial
    import serial.tools.list_ports
except:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyserial", "-q"])
    import serial
    import serial.tools.list_ports

def main():
    print("="*50)
    print("   ARDUINO HARDWARE TEST")
    print("="*50)
    
    # Find Arduino
    arduino_port = None
    for p in serial.tools.list_ports.comports():
        if p.vid == 0x2341:  # Arduino VID
            arduino_port = p.device
            print(f"\n✓ Found Arduino on {p.device}")
            break
    
    if not arduino_port:
        print("\n✗ No Arduino found!")
        return
    
    # Try to open port
    print(f"\nTesting port {arduino_port}...")
    
    try:
        ser = serial.Serial(arduino_port, 1200, timeout=1)
        ser.close()
        print("✓ Port opened at 1200 baud (triggers reset)")
    except Exception as e:
        print(f"✗ Cannot open port: {e}")
        print("\n→ Another program is using the port!")
        print("→ Close Arduino IDE, Serial Monitor, or any terminal")
        return
    
    import time
    time.sleep(2)  # Wait for bootloader
    
    try:
        ser = serial.Serial(arduino_port, 115200, timeout=1)
        print("✓ Port reopened at 115200 baud")
        
        # Try to get bootloader response
        ser.write(b'0 ')  # STK500 sync command
        time.sleep(0.1)
        response = ser.read(100)
        ser.close()
        
        if response:
            print(f"✓ Got response: {response.hex()}")
            print("\n★ YOUR ARDUINO HARDWARE IS WORKING! ★")
            print("\nThe upload issue might be timing-related.")
            print("Try pressing RESET button right when upload starts.")
        else:
            print("✗ No response from bootloader")
            print("\n→ Your Arduino bootloader may be corrupted")
            print("→ Or the board needs manual reset during upload")
            
    except Exception as e:
        print(f"✗ Error: {e}")
    
    print("\n" + "="*50)
    print("TEST COMPLETE")
    print("="*50)
    
    input("\nPress Enter to exit...")

if __name__ == "__main__":
    main()