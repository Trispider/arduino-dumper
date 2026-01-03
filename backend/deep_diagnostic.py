#!/usr/bin/env python3
"""
Arduino Deep Diagnostic
=======================
Tests if your Arduino can communicate at all
"""

import sys
import time
import subprocess

try:
    import serial
    import serial.tools.list_ports
except:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "pyserial", "-q"])
    import serial
    import serial.tools.list_ports


def find_arduino():
    """Find Arduino port."""
    for p in serial.tools.list_ports.comports():
        if p.vid == 0x2341:  # Arduino
            return p.device, "Arduino Uno (genuine)"
        if p.vid == 0x1A86:  # CH340
            return p.device, "Arduino Clone (CH340)"
    return None, None


def test_serial_communication(port):
    """Test if we can communicate with Arduino at all."""
    print(f"\n{'='*60}")
    print(f"TESTING SERIAL COMMUNICATION ON {port}")
    print(f"{'='*60}\n")
    
    # Test 1: Can we open the port?
    print("TEST 1: Opening port...")
    try:
        ser = serial.Serial(port, 9600, timeout=2)
        print(f"  ✓ Port opened successfully")
        ser.close()
        time.sleep(0.5)
    except Exception as e:
        print(f"  ✗ FAILED: {e}")
        print("\n  → Another program is using the port!")
        print("  → Close Arduino IDE, Serial Monitor, etc.")
        return False
    
    # Test 2: DTR reset (this is how auto-reset works)
    print("\nTEST 2: Testing DTR auto-reset...")
    try:
        ser = serial.Serial(port, 9600, timeout=2)
        print("  Toggling DTR (this should reset Arduino)...")
        ser.setDTR(False)
        time.sleep(0.1)
        ser.setDTR(True)
        time.sleep(2)  # Wait for bootloader
        
        # Try to read any data
        data = ser.read(100)
        ser.close()
        
        if data:
            print(f"  ✓ Received data after reset: {data}")
            print("  → Your Arduino IS responding!")
        else:
            print("  ⚠ No data received after reset")
            print("  → This is normal if no sketch is running")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    # Test 3: Bootloader baud rate test
    print("\nTEST 3: Testing bootloader communication (115200 baud)...")
    try:
        # Open at 1200 to trigger reset
        ser = serial.Serial(port, 1200)
        ser.close()
        time.sleep(0.5)
        
        # Now open at 115200 (bootloader speed)
        ser = serial.Serial(port, 115200, timeout=1)
        time.sleep(0.1)
        
        # Send STK500 sync command
        ser.write(bytes([0x30, 0x20]))  # STK_GET_SYNC + CRC_EOP
        time.sleep(0.2)
        
        response = ser.read(10)
        ser.close()
        
        if response:
            print(f"  ✓ Got bootloader response: {response.hex()}")
            if response == bytes([0x14, 0x10]):
                print("  ★ BOOTLOADER IS WORKING! ★")
                return True
            else:
                print(f"  ⚠ Unexpected response (not STK500)")
        else:
            print("  ✗ No response from bootloader")
            print("\n  POSSIBLE CAUSES:")
            print("  1. Bootloader is corrupted or missing")
            print("  2. Wrong baud rate for your bootloader")
            print("  3. Hardware issue with the board")
            
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    # Test 4: Try different baud rates
    print("\nTEST 4: Trying different bootloader baud rates...")
    for baud in [57600, 19200, 9600]:
        try:
            ser = serial.Serial(port, 1200)
            ser.close()
            time.sleep(0.5)
            
            ser = serial.Serial(port, baud, timeout=0.5)
            ser.write(bytes([0x30, 0x20]))
            time.sleep(0.2)
            response = ser.read(10)
            ser.close()
            
            if response:
                print(f"  ✓ Got response at {baud} baud: {response.hex()}")
            else:
                print(f"  - No response at {baud} baud")
        except Exception as e:
            print(f"  - Error at {baud}: {e}")
    
    return False


def test_loopback(port):
    """Test if the USB-Serial chip works by loopback test."""
    print(f"\n{'='*60}")
    print("LOOPBACK TEST (Tests USB-Serial chip)")
    print(f"{'='*60}")
    print("""
To perform this test:
1. Disconnect all wires from your Arduino
2. Connect a wire from Pin 0 (RX) to Pin 1 (TX)
3. Press Enter when ready...
""")
    input()
    
    try:
        ser = serial.Serial(port, 9600, timeout=1)
        test_data = b"HELLO_ARDUINO_TEST"
        ser.write(test_data)
        time.sleep(0.2)
        received = ser.read(len(test_data))
        ser.close()
        
        if received == test_data:
            print(f"  ✓ LOOPBACK PASSED! Received: {received}")
            print("  → USB-Serial chip is working correctly")
            return True
        elif received:
            print(f"  ⚠ Partial data received: {received}")
        else:
            print("  ✗ No data received")
            print("  → USB-Serial chip may have issues")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    return False


def check_board_info():
    """Use arduino-cli to check board."""
    print(f"\n{'='*60}")
    print("ARDUINO-CLI BOARD DETECTION")
    print(f"{'='*60}\n")
    
    try:
        result = subprocess.run(
            ["arduino-cli", "board", "list", "--format", "text"],
            capture_output=True, timeout=30
        )
        print(result.stdout.decode())
        if result.stderr:
            print("Errors:", result.stderr.decode())
    except FileNotFoundError:
        print("  arduino-cli not found in PATH")
    except Exception as e:
        print(f"  Error: {e}")


def main():
    print("""
╔═══════════════════════════════════════════════════════════╗
║           ARDUINO DEEP DIAGNOSTIC                         ║
╚═══════════════════════════════════════════════════════════╝
""")
    
    port, board_type = find_arduino()
    
    if not port:
        print("✗ No Arduino found!")
        print("  Connect your Arduino and try again.")
        input("\nPress Enter to exit...")
        return
    
    print(f"Found: {board_type} on {port}\n")
    
    # Run tests
    check_board_info()
    bootloader_ok = test_serial_communication(port)
    
    if not bootloader_ok:
        print(f"\n{'='*60}")
        print("DIAGNOSIS: BOOTLOADER NOT RESPONDING")
        print(f"{'='*60}")
        print("""
Your Arduino's bootloader is not responding to programming commands.

SOLUTIONS (try in order):

1. TRY A DIFFERENT USB CABLE
   Some cables are charge-only and don't have data wires.
   
2. TRY A DIFFERENT USB PORT
   Use a port directly on your computer, not a hub.

3. CHECK FOR SHORTS
   Make sure nothing is connected to pins 0 and 1.

4. REFLASH THE BOOTLOADER
   If you have another Arduino, you can use it to reflash
   the bootloader using "Arduino as ISP" method.

5. THE BOARD MAY BE DEFECTIVE
   If nothing works, the ATmega328P chip or USB-Serial
   chip may be damaged.
""")
        
        print("\nWould you like to run the loopback test? (y/n): ", end="")
        if input().lower() == 'y':
            test_loopback(port)
    else:
        print(f"\n{'='*60}")
        print("✓ BOOTLOADER IS RESPONDING!")
        print(f"{'='*60}")
        print("""
Good news! Your bootloader responded. The upload issue might be
a timing problem. Try:

1. Use Arduino IDE to upload a simple sketch
2. If Arduino IDE works, there may be a timing issue with arduino-cli
""")
    
    input("\nPress Enter to exit...")


if __name__ == "__main__":
    main()