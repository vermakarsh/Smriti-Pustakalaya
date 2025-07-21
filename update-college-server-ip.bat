@echo off
echo ========================================
echo    Update College Server IP
echo ========================================
echo.

echo 📱 Smriti Pustakalaya Mobile App
echo 🔧 Update College Server IP Configuration
echo.

set /p college_ip="Enter your college server IP: "

echo.
echo 🔧 Updating configuration for college server: %college_ip%
echo.

cd Library-Management

echo Updating environment configuration...
powershell -Command "(Get-Content src/config/environment.ts) -replace '192.168.69.195', '%college_ip%' | Set-Content src/config/environment.ts"

echo Updating app configuration...
powershell -Command "(Get-Content app.config.js) -replace '192.168.69.195', '%college_ip%' | Set-Content app.config.js"

echo.
echo ✅ Configuration updated successfully!
echo.
echo 📱 Mobile app will now connect to:
echo 🌐 College Server: http://%college_ip%:5000
echo 📡 API Endpoint: http://%college_ip%:5000/api
echo.
echo 🏗️ Next step: Run build-apk-for-college.bat to build APK
echo.

pause 