@echo off
cd /d "%~dp0"
echo Opening Learning Grove at http://localhost:8787
start "" "http://localhost:8787"
python -m http.server 8787
pause
