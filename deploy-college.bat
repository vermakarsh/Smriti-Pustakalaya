@echo off
echo ========================================
echo    Smriti Pustakalaya Deployment
echo ========================================
echo.

echo 🏫 College Library Management System
echo 📦 Deployment Script for Windows
echo.

:menu
echo Choose deployment option:
echo 1. Local Network Deployment
echo 2. Docker Deployment
echo 3. Cloud Deployment (AWS)
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto local
if "%choice%"=="2" goto docker
if "%choice%"=="3" goto cloud
if "%choice%"=="4" goto exit
echo Invalid choice. Please try again.
goto menu

:local
echo.
echo ========================================
echo    Local Network Deployment
echo ========================================
echo.

echo 📋 Prerequisites Check:
echo - Node.js installed
echo - MongoDB installed
echo - Network access configured
echo.

set /p server_ip="Enter your college server IP: "
set /p admin_port="Enter admin panel port (default 3000): "
if "%admin_port%"=="" set admin_port=3000

echo.
echo 🔧 Configuring for IP: %server_ip%
echo.

echo Updating backend configuration...
cd backend
copy production.env .env
powershell -Command "(Get-Content .env) -replace 'your-college-ip', '%server_ip%' | Set-Content .env"

echo Installing backend dependencies...
call npm install

echo Initializing database...
call node database-setup.js init

echo Starting backend server...
start "Library Backend" cmd /k "npm start"

cd ..

echo.
echo 🌐 Updating admin panel configuration...
cd smriti-pustakalaya
powershell -Command "(Get-Content src/config/api.js) -replace 'localhost:5000', '%server_ip%:5000' | Set-Content src/config/api.js"

echo Installing admin panel dependencies...
call npm install

echo Building admin panel...
call npm run build

echo Starting admin panel...
start "Library Admin Panel" cmd /k "npx serve -s build -l %admin_port%"

cd ..

echo.
echo 📱 Mobile App Configuration:
echo Update Library-Management/src/config/api.ts with:
echo export const API_BASE_URL = 'http://%server_ip%:5000/api';
echo.

echo ✅ Local deployment completed!
echo.
echo 🌐 Access URLs:
echo - Admin Panel: http://%server_ip%:%admin_port%
echo - Backend API: http://%server_ip%:5000
echo.
pause
goto menu

:docker
echo.
echo ========================================
echo    Docker Deployment
echo ========================================
echo.

echo 📋 Prerequisites Check:
echo - Docker installed
echo - Docker Compose installed
echo.

set /p server_ip="Enter your college server IP: "

echo.
echo 🐳 Building and starting containers...
docker-compose up -d

echo.
echo ✅ Docker deployment completed!
echo.
echo 🌐 Access URLs:
echo - Admin Panel: http://%server_ip%:3000
echo - Backend API: http://%server_ip%:5000
echo.
pause
goto menu

:cloud
echo.
echo ========================================
echo    Cloud Deployment (AWS)
echo ========================================
echo.

echo 📋 Prerequisites Check:
echo - AWS CLI installed and configured
echo - EC2 instance running
echo - Security groups configured
echo.

echo 🚀 This will guide you through AWS deployment...
echo.
echo 1. Launch EC2 instance (Ubuntu 20.04)
echo 2. Configure security groups (ports 22, 80, 443, 3000, 5000)
echo 3. Connect via SSH
echo 4. Run deployment commands
echo.

echo 📝 Deployment commands for EC2:
echo.
echo # Install dependencies
echo sudo apt update
echo sudo apt install -y nodejs npm mongodb docker.io docker-compose
echo.
echo # Clone repository
echo git clone your-repo-url
echo cd library-system
echo.
echo # Deploy with Docker
echo sudo docker-compose up -d
echo.
echo # Or deploy manually
echo cd backend && npm install && npm start
echo cd ../smriti-pustakalaya && npm install && npm run build && npx serve -s build -l 3000
echo.

pause
goto menu

:exit
echo.
echo 👋 Thank you for using Smriti Pustakalaya!
echo 🎓 Good luck with your college deployment!
echo.
pause
exit 