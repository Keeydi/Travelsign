@echo off
cd /d "%~dp0"
echo Starting Travelsign...
echo.
echo [1/2] Backend (Flask on port 5000)...
start "Travelsign Backend" cmd /k "cd /d %~dp0backend && set GEMINI_API_KEY=AIzaSyAvesAiVBlSj6wDlGfGI5qvXmKYlIyyfqU && python server.py"
timeout /t 2 /nobreak >nul
echo [2/2] Frontend (Expo)...
start "Travelsign Frontend" cmd /k "cd /d %~dp0 && npm start"
echo.
echo Backend and Frontend windows should have opened.
echo If the Frontend window shows an error, run in a terminal: cd "%~dp0" && npm start
pause
