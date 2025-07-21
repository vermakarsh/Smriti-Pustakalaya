# 📱 Mobile APK Build Summary - College Server Connection

## 🎯 What You Need to Do

Build a React Native APK that connects to your college server backend and distribute it to employees.

## 📋 Quick Steps

### **Step 1: Update College Server IP**
```bash
# Windows
update-college-server-ip.bat

# Linux/Mac
chmod +x update-college-server-ip.sh
./update-college-server-ip.sh
```

### **Step 2: Build APK**
```bash
# Windows
build-apk-for-college.bat

# Linux/Mac
chmod +x build-apk-for-college.sh
./build-apk-for-college.sh
```

### **Step 3: Distribute APK**
1. Download APK from Expo dashboard
2. Share with college employees
3. Install on employee devices

---

## 🔧 Configuration Files

### **Environment Configuration**
- `Library-Management/src/config/environment.ts` - API URLs for different environments
- `Library-Management/src/config/api.ts` - API endpoints and configuration
- `Library-Management/app.config.js` - Expo app configuration

### **Build Scripts**
- `build-apk-for-college.bat` - Windows APK build script
- `build-apk-for-college.sh` - Linux/Mac APK build script
- `update-college-server-ip.bat` - Windows IP update script

---

## 🌐 Connection Setup

### **Development vs Production**
- **Development**: `http://localhost:5000/api` (for testing)
- **Production**: `http://YOUR_COLLEGE_IP:5000/api` (for college server)

### **Environment Detection**
The app automatically detects the environment:
- **Development**: Uses localhost for testing
- **Production**: Uses college server IP for deployment

---

## 📱 APK Features

### **Employee Features**
- 📚 Book donation
- 👀 View donations
- ✏️ Edit donations
- 🗑️ Delete donations
- 📊 View statistics
- 🔐 Secure login

### **Technical Features**
- 🔄 Real-time data sync
- 🌐 Network error handling
- 📱 Offline capability
- 🔒 Secure authentication
- 🎨 Hindi language interface

---

## 🔗 Testing Connection

### **Before Building APK**
```bash
# Test college server connection
curl http://YOUR_COLLEGE_IP:5000/api/books

# Test mobile app locally
cd Library-Management
npx expo start
# Scan QR code with Expo Go app
```

### **After Installing APK**
1. Open app on employee device
2. Test login functionality
3. Test book donation
4. Test viewing donations
5. Test delete functionality

---

## 🛠️ Troubleshooting

### **Common Issues**

#### 1. **APK Won't Connect to Server**
- Check college server IP is correct
- Verify backend is running on port 5000
- Test network connectivity
- Check firewall settings

#### 2. **APK Build Fails**
- Clear Expo cache: `npx expo r -c`
- Clear npm cache: `npm cache clean --force`
- Reinstall dependencies: `rm -rf node_modules && npm install`

#### 3. **App Crashes on Launch**
- Check API configuration
- Verify server is accessible
- Review app logs
- Test with development server first

---

## 📊 Distribution Options

### **Option 1: Direct APK Distribution**
- Download APK from Expo dashboard
- Share file with employees
- Enable "Install from unknown sources"
- Install on devices

### **Option 2: QR Code Distribution**
```bash
cd Library-Management
npx expo start
# Share QR code with employees
# Employees scan with Expo Go app
```

### **Option 3: Internal App Store**
- Upload APK to internal store
- Employees download from store
- Automatic updates through store

---

## 🔄 Update Process

### **For App Updates**
1. Update code in `Library-Management/`
2. Update version in `app.json`
3. Run build script again
4. Distribute new APK to employees

### **For Backend Updates**
1. Update backend on college server
2. Test API endpoints
3. Mobile app will work automatically
4. No APK update needed

---

## 📞 Support Commands

### **Debug Mobile App**
```bash
# View Expo logs
npx expo logs

# Test specific API endpoint
curl http://YOUR_COLLEGE_IP:5000/api/books

# Check server status
pm2 status
```

### **Server Status**
```bash
# Check backend
pm2 logs library-backend

# Check MongoDB
sudo systemctl status mongod

# Test API
curl http://YOUR_COLLEGE_IP:5000/api/dashboard/stats
```

---

## 🎉 Success Checklist

### **Pre-Build**
- [ ] College server IP updated
- [ ] Backend running on college server
- [ ] API endpoints accessible
- [ ] Network connectivity verified

### **Post-Build**
- [ ] APK builds successfully
- [ ] APK installs on test device
- [ ] App connects to college server
- [ ] All features work correctly

### **Distribution**
- [ ] APK shared with employees
- [ ] Employees can install APK
- [ ] Login works with employee credentials
- [ ] All features work on employee devices

---

## 📈 Expected Results

### **For Employees**
- Easy book donation process
- Real-time donation tracking
- Mobile-friendly interface
- Hindi language support

### **For Administration**
- Centralized donation management
- Real-time statistics
- Employee activity tracking
- Automated reporting

---

## 🚀 Quick Start Commands

```bash
# 1. Update college server IP
./update-college-server-ip.sh

# 2. Build APK
./build-apk-for-college.sh

# 3. Test connection
curl http://YOUR_COLLEGE_IP:5000/api/books

# 4. Distribute APK to employees
```

---

**📱 Your mobile app is ready to connect to the college server!**

Follow these steps to build and distribute your APK successfully. The app will automatically connect to your college server backend and provide all the necessary features for book donation management. 