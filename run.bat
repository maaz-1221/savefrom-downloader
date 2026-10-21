@echo off
title SaveFrom Video Downloader Server
cd /d "%~dp0"
echo ========================================================
echo   Starting SaveFrom.net Web Downloader Application...
echo ========================================================
echo.
echo Opening browser at http://localhost:8000
start http://localhost:8000
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
pause
