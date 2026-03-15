@echo off
cd /d "%~dp0"

echo Starting Travelsign...
echo.
echo [1/2] Backend (Flask on port 5000) - uses backend\.env
start "Travelsign Backend" cmd /k "cd /d %~dp0backend && python server.py"
timeout /t 2 /nobreak >nul

echo [2/2] Frontend (Expo)
start "Travelsign Frontend" cmd /k "cd /d %~dp0 && npm start"

echo.
echo Backend and frontend started. Backend reads from backend\.env only.
pause
