# 📱 Mobile APK Build Guide - College Server Connection

## 🎯 Overview
Build a React Native APK that connects to your college server backend.

## 📋 Prerequisites

### **Local Development Machine**
- Node.js installed
- Expo CLI installed
- Android Studio (for APK build)
- Git installed

### **College Server**
- Backend running on college server IP
- Port 5000 accessible
- API endpoints working

---

## 🚀 Step-by-Step Process

### **Step 1: Update Mobile App Configuration**

#### 1.1 Update API Configuration
Edit `Library-Management/src/config/api.ts`:
```typescript
// Replace localhost with your college server IP
export const API_BASE_URL = 'http://YOUR_COLLEGE_SERVER_IP:5000/api';
```

#### 1.2 Update App Configuration
Edit `Library-Management/app.json`:
```json
{
  "expo": {
    "name": "Smriti Pustakalaya",
    "slug": "smriti-pustakalaya",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "updates": {
      "fallbackToCacheTimeout": 0
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#FFFFFF"
      },
      "package": "com.yourcollege.smritipustakalaya"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### **Step 2: Test Connection**

#### 2.1 Test Backend Connection
```bash
# Test if your college server backend is accessible
curl http://YOUR_COLLEGE_SERVER_IP:5000/api/books
```

#### 2.2 Test Mobile App Locally
```bash
cd Library-Management
npx expo start
# Scan QR code with Expo Go app to test
```

### **Step 3: Build APK**

#### 3.1 Install Dependencies
```bash
cd Library-Management
npm install
```

#### 3.2 Build APK with Expo
```bash
# Build APK for Android
npx expo build:android --type apk

# Or build AAB (Android App Bundle) for Play Store
npx expo build:android --type app-bundle
```

#### 3.3 Alternative: Build Locally
```bash
# Eject to bare React Native (if needed)
npx expo eject

# Build APK locally
cd android
./gradlew assembleRelease
```

---

## 🔧 Configuration Files

### **Environment Configuration**
Create `Library-Management/src/config/environment.ts`:
```typescript
export const ENVIRONMENT = {
  development: {
    API_BASE_URL: 'http://localhost:5000/api',
    SERVER_URL: 'http://localhost:5000'
  },
  production: {
    API_BASE_URL: 'http://YOUR_COLLEGE_SERVER_IP:5000/api',
    SERVER_URL: 'http://YOUR_COLLEGE_SERVER_IP:5000'
  }
};

export const getApiUrl = () => {
  return __DEV__ 
    ? ENVIRONMENT.development.API_BASE_URL 
    : ENVIRONMENT.production.API_BASE_URL;
};
```

### **Network Security Configuration**
For Android API 28+, add `android/app/src/main/res/xml/network_security_config.xml`:
```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">YOUR_COLLEGE_SERVER_IP</domain>
    </domain-config>
</network-security-config>
```

Update `android/app/src/main/AndroidManifest.xml`:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

---

## 📱 APK Distribution Options

### **Option 1: Direct APK Distribution**
1. Download APK from Expo dashboard
2. Share APK file with college employees
3. Install on employee devices
4. Enable "Install from unknown sources" on devices

### **Option 2: QR Code Distribution**
```bash
# Start Expo development server
npx expo start

# Share QR code with employees
# Employees scan with Expo Go app
```

### **Option 3: Internal App Store**
- Upload APK to internal app store
- Employees download from internal store
- Automatic updates through store

---

## 🔗 Connection Testing

### **Test API Endpoints**
```bash
# Test books endpoint
curl http://YOUR_COLLEGE_SERVER_IP:5000/api/books

# Test dashboard stats
curl http://YOUR_COLLEGE_SERVER_IP:5000/api/dashboard/stats

# Test employees endpoint
curl http://YOUR_COLLEGE_SERVER_IP:5000/api/employees
```

### **Test Mobile App Features**
1. **Login**: Test employee login
2. **Donation**: Test book donation
3. **View**: Test viewing donations
4. **Delete**: Test deleting donations
5. **Stats**: Test viewing statistics

---

## 🛠️ Troubleshooting

### **Common Issues**

#### 1. **Network Connection Failed**
```bash
# Check if server is accessible
ping YOUR_COLLEGE_SERVER_IP

# Check if port is open
telnet YOUR_COLLEGE_SERVER_IP 5000

# Check firewall settings
sudo ufw status
```

#### 2. **CORS Errors**
Update backend CORS configuration in `backend/src/app.js`:
```javascript
app.use(cors({
  origin: [
    'http://YOUR_COLLEGE_SERVER_IP:3000',
    'http://localhost:3000',
    'http://localhost:8081',
    'exp://localhost:8081'
  ],
  credentials: true
}));
```

#### 3. **APK Build Failed**
```bash
# Clear Expo cache
npx expo r -c

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

#### 4. **App Crashes on Launch**
- Check API URL configuration
- Verify server is running
- Check network connectivity
- Review app logs

---

## 📊 Testing Checklist

### **Pre-Build Testing**
- [ ] API endpoints accessible
- [ ] Mobile app connects to backend
- [ ] All features working locally
- [ ] Network security configured

### **Post-Build Testing**
- [ ] APK installs successfully
- [ ] App launches without crashes
- [ ] Login functionality works
- [ ] All features work with college server
- [ ] Network errors handled gracefully

### **User Testing**
- [ ] Employees can install APK
- [ ] Login with employee credentials
- [ ] Book donation process works
- [ ] View and manage donations
- [ ] Statistics display correctly

---

## 🔄 Update Process

### **For App Updates**
1. Update code in `Library-Management/`
2. Update version in `app.json`
3. Build new APK
4. Distribute to employees
5. Instruct users to install new version

### **For Backend Updates**
1. Update backend on college server
2. Test API endpoints
3. Verify mobile app still works
4. No mobile app update needed

---

## 📞 Support Commands

### **Debug Mobile App**
```bash
# View Expo logs
npx expo logs

# Debug network requests
# Add console.log in API calls

# Test specific endpoint
curl -X POST http://YOUR_COLLEGE_SERVER_IP:5000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Book","author":"Test Author"}'
```

### **Server Status Check**
```bash
# Check if backend is running
pm2 status

# Check backend logs
pm2 logs library-backend

# Test API directly
curl http://YOUR_COLLEGE_SERVER_IP:5000/api/books
```

---

## 🎉 Success Criteria

### **Functional Requirements**
- [ ] APK builds successfully
- [ ] App installs on employee devices
- [ ] Connects to college server backend
- [ ] All features work correctly
- [ ] Network errors handled properly

### **Performance Requirements**
- [ ] App loads within 5 seconds
- [ ] API calls complete within 3 seconds
- [ ] Smooth navigation between screens
- [ ] No memory leaks or crashes

### **User Experience**
- [ ] Intuitive Hindi interface
- [ ] Easy book donation process
- [ ] Clear error messages
- [ ] Offline handling where possible

---

**📱 Your mobile app is ready to connect to the college server!**

Follow this guide step by step to build and distribute your APK successfully. 