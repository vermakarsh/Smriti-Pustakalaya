@echo off
echo ========================================
echo    Mobile APK Build for College Server
echo ========================================
echo.

echo 📱 Smriti Pustakalaya Mobile App
echo 🏗️  APK Build for College Server Connection
echo.

set /p college_ip="Enter your college server IP: "
set /p app_name="Enter app name (default: Smriti Pustakalaya): "
if "%app_name%"=="" set app_name=Smriti Pustakalaya

echo.
echo 🔧 Configuring mobile app for college server: %college_ip%
echo.

cd Library-Management

echo Updating API configuration...
powershell -Command "(Get-Content src/config/api.ts) -replace 'localhost:5000', '%college_ip%:5000' | Set-Content src/config/api.ts"

echo Updating app configuration...
powershell -Command "(Get-Content app.json) -replace 'Smriti Pustakalaya', '%app_name%' | Set-Content app.json"

echo Installing dependencies...
call npm install

echo.
echo 🔍 Testing connection to college server...
echo.

powershell -Command "try { $response = Invoke-WebRequest -Uri 'http://%college_ip%:5000/api/books' -Method GET -TimeoutSec 10; Write-Host '✅ Connection successful!' } catch { Write-Host '❌ Connection failed. Please check:' -ForegroundColor Red; Write-Host '   - Server IP is correct' -ForegroundColor Yellow; Write-Host '   - Backend is running on port 5000' -ForegroundColor Yellow; Write-Host '   - Network connectivity' -ForegroundColor Yellow }"

echo.
echo 🏗️ Building APK...
echo This may take 10-15 minutes...
echo.

call npx expo build:android --type apk

echo.
echo ✅ APK build completed!
echo.
echo 📱 Next steps:
echo 1. Download APK from Expo dashboard
echo 2. Share APK with college employees
echo 3. Install on employee devices
echo 4. Enable "Install from unknown sources" on devices
echo.
echo 🌐 College Server URL: http://%college_ip%:5000
echo 📱 Mobile App will connect to: http://%college_ip%:5000/api
echo.

pause 