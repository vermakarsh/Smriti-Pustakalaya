@echo off
echo ========================================
echo    Mobile App Build Script
echo ========================================
echo.

echo 📱 Smriti Pustakalaya Mobile App
echo 🏗️  APK Build for College Deployment
echo.

set /p server_ip="Enter your college server IP: "
set /p app_name="Enter app name (default: Smriti Pustakalaya): "
if "%app_name%"=="" set app_name=Smriti Pustakalaya

echo.
echo 🔧 Configuring mobile app for IP: %server_ip%
echo.

cd Library-Management

echo Updating API configuration...
powershell -Command "(Get-Content src/config/api.ts) -replace 'localhost:5000', '%server_ip%:5000' | Set-Content src/config/api.ts"

echo Updating app configuration...
powershell -Command "(Get-Content app.json) -replace 'Smriti Pustakalaya', '%app_name%' | Set-Content app.json"

echo Installing dependencies...
call npm install

echo.
echo 🏗️ Building APK...
echo This may take several minutes...
echo.

call npx expo build:android --type apk

echo.
echo ✅ APK build completed!
echo.
echo 📱 Next steps:
echo 1. Download APK from Expo dashboard
echo 2. Share APK with college employees
echo 3. Install on employee devices
echo.
echo 🌐 Server URL: http://%server_ip%:5000
echo.

pause 