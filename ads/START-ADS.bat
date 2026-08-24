@echo off
cd /d "%~dp0\.."
echo Opening Scenic City Learning ad kit
start "" "http://localhost:8788/ads/"
python -m http.server 8788
pause
