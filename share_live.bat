@echo off
title Share SaveFrom Live Over Internet
cd /d "%~dp0"
echo ========================================================
echo   Starting SaveFrom Downloader & Making it LIVE...
echo ========================================================
echo.
echo [1/2] Starting local server on port 8000...
start /b python -m uvicorn app:app --host 127.0.0.1 --port 8000
timeout /t 2 /nobreak >nul

echo [2/2] Connecting to public live HTTPS tunnel...
echo.
echo ========================================================
echo   YOUR LIVE PUBLIC LINK IS GENERATING BELOW:
echo   Share the https:// link with ANYONE on mobile or PC!
echo ========================================================
echo.
ssh -o StrictHostKeyChecking=no -R 80:127.0.0.1:8000 nokey@localhost.run
pause
