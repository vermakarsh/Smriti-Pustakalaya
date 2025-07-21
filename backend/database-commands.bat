@echo off
chcp 65001 >nul
title Smriti Pustakalaya Database Management

echo.
echo ========================================
echo   Smriti Pustakalaya Database Manager
echo ========================================
echo.

:menu
echo Choose an option:
echo.
echo 1. Initialize Database (with sample data)
echo 2. Reset Database (clear all data)
echo 3. Show Database Statistics
echo 4. Create Backup
echo 5. List Available Backups
echo 6. Clean Old Backups
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto init
if "%choice%"=="2" goto reset
if "%choice%"=="3" goto stats
if "%choice%"=="4" goto backup
if "%choice%"=="5" goto list
if "%choice%"=="6" goto clean
if "%choice%"=="7" goto exit
goto menu

:init
echo.
echo 🚀 Initializing database with sample data...
node database-setup.js init
echo.
pause
goto menu

:reset
echo.
echo ⚠️  WARNING: This will delete ALL data!
set /p confirm="Are you sure? (y/N): "
if /i "%confirm%"=="y" (
    echo 🗑️  Resetting database...
    node database-setup.js reset
) else (
    echo ❌ Reset cancelled.
)
echo.
pause
goto menu

:stats
echo.
echo 📊 Showing database statistics...
node database-setup.js stats
echo.
pause
goto menu

:backup
echo.
echo 💾 Creating database backup...
node database-backup.js backup
echo.
pause
goto menu

:list
echo.
echo 📁 Listing available backups...
node database-backup.js list
echo.
pause
goto menu

:clean
echo.
set /p days="Enter number of days to keep (default 30): "
if "%days%"=="" set days=30
echo 🧹 Cleaning backups older than %days% days...
node database-backup.js clean %days%
echo.
pause
goto menu

:exit
echo.
echo 👋 Thank you for using Smriti Pustakalaya Database Manager!
echo.
pause
exit 