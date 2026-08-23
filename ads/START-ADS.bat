@echo off
cd /d "%~dp0\.."
echo Opening Learning Grove ad kit
start "" "http://localhost:8788/ads/"
python -m http.server 8788
pause
