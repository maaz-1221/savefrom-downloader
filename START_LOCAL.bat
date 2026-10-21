@echo off
title SaveFrom.net - Local Server
color 0B
cls
echo Starting SaveFrom.net on http://localhost:8000 ...
python -m pip install -r requirements.txt --quiet
python -m uvicorn app:app --host 127.0.0.1 --port 8000
pause
