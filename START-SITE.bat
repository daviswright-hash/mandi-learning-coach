@echo off
cd /d "%~dp0"
echo Opening Scenic City Learning at http://localhost:8787
start "" "http://localhost:8787"
python -m http.server 8787
pause
