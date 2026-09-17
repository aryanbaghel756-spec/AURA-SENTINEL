@echo off
title AURA SENTINEL - GITHUB PUSH
color 0B
cls
echo ==============================================================================
echo   AURA SENTINEL - PUSHING TO GITHUB REPOSITORY
echo   Target: https://github.com/aryanbaghel756-spec/AURA-SENTINEL
echo ==============================================================================
echo.
cd /d "%~dp0"
echo [*] Pushing commit 322d1bd to GitHub main branch...
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ==============================================================================
    echo   [SUCCESS] All files and commits successfully uploaded to GitHub!
    echo ==============================================================================
) else (
    color 0C
    echo ==============================================================================
    echo   [!] Push incomplete. Please sign in if browser window appeared.
    echo ==============================================================================
)
echo.
pause
