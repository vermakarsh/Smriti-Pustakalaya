#!/bin/bash

echo "========================================"
echo "   Mobile APK Build for College Server"
echo "========================================"
echo

echo "📱 Smriti Pustakalaya Mobile App"
echo "🏗️  APK Build for College Server Connection"
echo

read -p "Enter your college server IP: " college_ip
read -p "Enter app name (default: Smriti Pustakalaya): " app_name
app_name=${app_name:-Smriti Pustakalaya}

echo
echo "🔧 Configuring mobile app for college server: $college_ip"
echo

cd Library-Management

echo "Updating API configuration..."
sed -i "s/localhost:5000/$college_ip:5000/g" src/config/api.ts

echo "Updating app configuration..."
sed -i "s/Smriti Pustakalaya/$app_name/g" app.json

echo "Installing dependencies..."
npm install

echo
echo "🔍 Testing connection to college server..."
echo

if curl -f "http://$college_ip:5000/api/books" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
else
    echo "❌ Connection failed. Please check:"
    echo "   - Server IP is correct"
    echo "   - Backend is running on port 5000"
    echo "   - Network connectivity"
    echo
    read -p "Continue with build anyway? (y/n): " continue_build
    if [[ $continue_build != "y" && $continue_build != "Y" ]]; then
        echo "Build cancelled."
        exit 1
    fi
fi

echo
echo "🏗️ Building APK..."
echo "This may take 10-15 minutes..."
echo

npx expo build:android --type apk

echo
echo "✅ APK build completed!"
echo
echo "📱 Next steps:"
echo "1. Download APK from Expo dashboard"
echo "2. Share APK with college employees"
echo "3. Install on employee devices"
echo "4. Enable 'Install from unknown sources' on devices"
echo
echo "🌐 College Server URL: http://$college_ip:5000"
echo "📱 Mobile App will connect to: http://$college_ip:5000/api"
echo 