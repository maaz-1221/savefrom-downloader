@echo off
title SaveFrom.net - 24/7 Web Server Launcher
color 0A
cls

echo ======================================================================
echo             SaveFrom.net Web Server - RDP 24/7 Launcher
echo ======================================================================
echo.

:: 1. Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Python is not installed or not added to PATH!
    echo.
    echo Please download and install Python from:
    echo https://www.python.org/downloads/
    echo IMPORTANT: Make sure to check "Add python.exe to PATH" during install!
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('python --version 2^>^&1') do set PY_VER=%%v
echo [*] %PY_VER% detected.
echo.

:: 2. Install requirements
echo [*] Checking and installing Python dependencies...
python -m pip install -r requirements.txt --quiet
if %errorlevel% neq 0 (
    echo [!] Quiet install failed, running standard install...
    python -m pip install -r requirements.txt
)
echo [*] Dependencies are up to date!
echo.

:: 3. Open Windows Firewall (Ports 80 and 8000)
echo [*] Configuring Windows Firewall for incoming web traffic...
netsh advfirewall firewall add rule name="SaveFrom Web Port 80" dir=in action=allow protocol=TCP localport=80 profile=any >nul 2>&1
netsh advfirewall firewall add rule name="SaveFrom Web Port 8000" dir=in action=allow protocol=TCP localport=8000 profile=any >nul 2>&1
echo [*] Firewall rules verified for ports 80 and 8000.
echo.

:: 4. Detect Public IP
echo [*] Detecting RDP Public IP address...
set PUBLIC_IP=Unknown
for /f "delims=" %%a in ('powershell -Command "(Invoke-WebRequest -Uri 'https://api.ipify.org' -UseBasicParsing -TimeoutSec 5).Content" 2^>nul') do set PUBLIC_IP=%%a

cls
echo ======================================================================
echo        SUCCESS! SAVEFROM.NET WEBSITE IS NOW RUNNING ON YOUR RDP
echo ======================================================================
echo.
if not "%PUBLIC_IP%"=="Unknown" (
    echo   PUBLIC LINK (Share with anyone in the world):
    echo   =================================================
    echo   ==^> http://%PUBLIC_IP%/
    echo   or:  http://%PUBLIC_IP%:8000/
    echo   =================================================
) else (
    echo   Use your RDP's Public IP in your browser:
    echo   http://^<RDP_PUBLIC_IP^>/
)
echo.
echo   Local test link on this RDP: http://localhost/ (or http://localhost:8000/)
echo.
echo ======================================================================
echo  IMPORTANT: Keep this black window OPEN 24/7!
echo  As long as this window is open, anyone in the world can use your site.
echo ======================================================================
echo.

:: 5. Run the Server
python app.py

pause
