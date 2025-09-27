@echo off
REM Wrapper to run git-push PowerShell script on Windows
SETLOCAL ENABLEDELAYEDEXPANSION

REM Pass all args to PowerShell script
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0git-push.ps1" %*
EXIT /B %ERRORLEVEL%
