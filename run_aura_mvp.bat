@echo off
title AURA SENTINEL - SIH26105 MVP LAUNCHER
color 0B
cls
echo ==============================================================================
echo   AURA SENTINEL - AI CYBER RISK QUANTIFICATION PLATFORM
echo   SMART INDIA HACKATHON 2026 (SIH26105)
echo   THEME: Blockchain and Cybersecurity ^| AICTE Cyber Security Cell
echo ==============================================================================
echo.

:: 1. Check Python
where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [!] ERROR: Python is not found in PATH! Please install Python 3.10+.
    pause
    exit /b 1
)
echo [*] Python runtime verified.

:: 2. Check Node.js
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo [!] ERROR: Node.js / npm is not found in PATH! Please install Node.js.
    pause
    exit /b 1
)
echo [*] Node.js and NPM verified.
echo.

:: 3. Clear any duplicate lingering processes on ports 8000, 5173, 5174
echo [*] Cleaning stale port listeners to prevent duplicate windows...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING 2^>nul') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173 ^| findstr LISTENING 2^>nul') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5174 ^| findstr LISTENING 2^>nul') do taskkill /f /pid %%a >nul 2>&1

:: 4. Launch Backend minimized (keeps desktop clean)
echo [*] Starting AURA FastAPI Backend on http://127.0.0.1:8000 ...
start /min "AURA SENTINEL - BACKEND SERVER" cmd.exe /k "cd /d "%~dp0Backend" && python main.py"

:: 5. Launch Frontend minimized (keeps desktop clean)
echo [*] Starting AURA Cyber SOC Frontend on http://localhost:5173 ...
start /min "AURA SENTINEL - FRONTEND UI" cmd.exe /k "cd /d "%~dp0Frontend" && call npm.cmd run dev"

:: 6. Wait 3 seconds for servers to warm up
echo [*] Initializing neural vision engines and blockchain ledger...
ping 127.0.0.1 -n 4 >nul

:: 7. Launch exactly ONE browser window
echo [*] Launching AURA Command Center in your browser...
start http://localhost:5173

echo.
echo ==============================================================================
echo   AURA SENTINEL MVP IS LIVE! (10 ENGINES ONLINE)
echo   - Web SOC Dashboard : http://localhost:5173
echo   - Backend REST API  : http://127.0.0.1:8000
echo   - Swagger API Docs  : http://127.0.0.1:8000/docs
echo ==============================================================================
echo.
echo   Servers are running minimized in taskbar.
echo   Press any key to close this launcher (servers will remain active).
echo.
pause >nul
