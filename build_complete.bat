@echo off
setlocal enabledelayedexpansion

echo.
echo  Arduino Flash Agent - Build
echo  Backend only, Frontend at https://dumper.web.app
echo.

set PYTHON_CMD=py

echo [1/3] Installing dependencies...
%PYTHON_CMD% -m pip install -q pyinstaller websockets pyserial
echo Done - Dependencies installed
echo.

echo [1.5/3] Closing any running instances...
taskkill /f /im ArduinoFlashAgent.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/3] Building executable...
%PYTHON_CMD% -m PyInstaller ^
    --onefile ^
    --console ^
    --name ArduinoFlashAgent ^
    backend\complete_integrated.py

if errorlevel 1 (
    echo ERROR: Build failed
    pause
    exit /b 1
)
echo Done - Executable built
echo.

echo [3/3] Verifying...
set EXEPATH=dist\ArduinoFlashAgent.exe
if exist "%EXEPATH%" (
    echo.
    echo  BUILD SUCCESSFUL
    echo  Location: %EXEPATH%
    echo.
    echo  Share ONLY: dist\ArduinoFlashAgent.exe
    echo.
    echo  How it works:
    echo    1. User double-clicks ArduinoFlashAgent.exe
    echo    2. Terminal opens - backend starts on ws://localhost:8765
    echo    3. Browser auto-opens https://dumper.web.app
    echo    4. Select device, flash board
    echo.
    echo  To bypass Windows SmartScreen:
    echo    Right-click exe - Properties - check Unblock - OK
    echo.
    if exist "build" rmdir /s /q build
    if exist "ArduinoFlashAgent.spec" del ArduinoFlashAgent.spec
) else (
    echo ERROR: exe not found
    pause
    exit /b 1
)

pause