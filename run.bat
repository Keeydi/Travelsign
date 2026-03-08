@echo off
cd /d "%~dp0"
echo Starting backend (Flask on port 5000)...
start "Travelsign Backend" cmd /k "cd /d "%~dp0backend" && python server.py"
timeout /t 2 /nobreak >nul
echo Starting frontend (Expo)...
call npm start
