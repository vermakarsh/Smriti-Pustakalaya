# 🏫 College Deployment Guide - Smriti Pustakalaya

## 🎯 Quick Start

### For Windows Users:
1. **Run Deployment Script**: Double-click `deploy-college.bat`
2. **Choose Option 1**: Local Network Deployment
3. **Enter Server IP**: Your college server's IP address
4. **Wait for Setup**: Script will configure everything automatically

### For Linux Users:
1. **Make Script Executable**: `chmod +x deploy-college.sh`
2. **Run Deployment**: `./deploy-college.sh`
3. **Choose Option 1**: Local Network Deployment
4. **Enter Server IP**: Your college server's IP address

---

## 📋 Prerequisites

### Server Requirements:
- **OS**: Windows 10/11 or Ubuntu 20.04+
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 10GB free space
- **Network**: Static IP address on college network

### Software Requirements:
- **Node.js**: Version 16 or higher
- **MongoDB**: Version 4.4 or higher
- **Git**: For version control (optional)

---

## 🚀 Deployment Options

### 1. **Local Network Deployment** (Recommended)
- Deploy on college server/computer
- Accessible via college network
- Full control over data and security
- No internet dependency

### 2. **Docker Deployment**
- Containerized deployment
- Easy to manage and update
- Consistent environment
- Quick setup

### 3. **Cloud Deployment**
- Deploy on AWS/Azure/Google Cloud
- Accessible from anywhere
- Scalable infrastructure
- Requires internet connection

---

## 🔧 Configuration

### Backend Configuration
File: `backend/production.env`
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_college_secret_key_here
NODE_ENV=production
CORS_ORIGIN=http://your-college-ip:3000
```

### Admin Panel Configuration
File: `smriti-pustakalaya/src/config/api.js`
```javascript
const API_BASE_URL = 'http://your-college-ip:5000/api';
```

### Mobile App Configuration
File: `Library-Management/src/config/api.ts`
```typescript
export const API_BASE_URL = 'http://your-college-ip:5000/api';
```

---

## 📱 Mobile App Distribution

### Option 1: APK Distribution
1. **Build APK**: Run `build-mobile-app.bat`
2. **Download APK**: From Expo dashboard
3. **Share APK**: With college employees
4. **Install**: On employee devices

### Option 2: QR Code Installation
1. **Start Expo**: `cd Library-Management && npx expo start`
2. **Share QR Code**: With employees
3. **Scan QR Code**: Using Expo Go app

---

## 🔒 Security Setup

### 1. Network Security
```bash
# Configure firewall (Windows)
netsh advfirewall firewall add rule name="Library Backend" dir=in action=allow protocol=TCP localport=5000
netsh advfirewall firewall add rule name="Library Admin" dir=in action=allow protocol=TCP localport=3000

# Configure firewall (Linux)
sudo ufw allow 5000
sudo ufw allow 3000
```

### 2. Database Security
```bash
# Enable MongoDB authentication
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase"]
})
```

### 3. Application Security
- Use strong JWT secrets
- Enable HTTPS in production
- Regular security updates
- Monitor access logs

---

## 📊 Monitoring & Maintenance

### 1. Check System Status
```bash
# Check backend status
curl http://your-college-ip:5000/api/books

# Check admin panel
curl http://your-college-ip:3000

# Check database
node database-setup.js stats
```

### 2. View Logs
```bash
# Backend logs
tail -f logs/backend.log

# Admin panel logs
tail -f logs/admin.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log
```

### 3. Database Backup
```bash
# Create backup
node database-backup.js backup

# Restore backup
node database-backup.js restore backup-2024-01-20.json
```

---

## 🆘 Troubleshooting

### Common Issues:

#### 1. **Port Already in Use**
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /PID <process_id> /F
```

#### 2. **MongoDB Connection Failed**
```bash
# Check MongoDB status
sudo systemctl status mongod
# Start MongoDB
sudo systemctl start mongod
```

#### 3. **CORS Errors**
- Verify CORS configuration in backend
- Check API URL in frontend
- Ensure correct port numbers

#### 4. **Mobile App Can't Connect**
- Verify server IP address
- Check network connectivity
- Ensure firewall allows connections

---

## 📞 Support & Documentation

### Available Scripts:
- `deploy-college.bat` - Windows deployment
- `deploy-college.sh` - Linux deployment
- `build-mobile-app.bat` - Mobile app build
- `database-setup.js` - Database management
- `database-backup.js` - Backup/restore

### Documentation Files:
- `DEPLOYMENT_GUIDE.md` - Detailed deployment guide
- `DATABASE_README.md` - Database management
- `INTEGRATION.md` - API integration guide

---

## 🎉 Success Checklist

- [ ] Backend server running on port 5000
- [ ] Admin panel accessible on port 3000
- [ ] Database initialized with sample data
- [ ] Mobile app can connect to backend
- [ ] All users can access the system
- [ ] Backup system configured
- [ ] Security measures implemented
- [ ] Firewall rules configured
- [ ] SSL certificate installed (optional)
- [ ] Monitoring setup complete

---

## 🌟 Features Available

### Admin Panel:
- 📚 Book management
- 👥 Employee management
- 📊 Dashboard analytics
- 🎁 Donation tracking
- 📈 Reports generation

### Mobile App:
- 📱 Book donation
- 👀 View donations
- ✏️ Edit donations
- 🗑️ Delete donations
- 📊 Statistics view

### Backend API:
- 🔐 JWT authentication
- 📚 RESTful book management
- 👥 Employee management
- 📊 Dashboard statistics
- 🔄 Real-time updates

---

## 🎓 College Benefits

### For Students:
- Easy book donation process
- Transparent donation tracking
- Access to library statistics
- Mobile-friendly interface

### For Staff:
- Efficient donation management
- Automated book tracking
- Real-time statistics
- User-friendly interface

### For Administration:
- Complete donation overview
- Employee management
- Data analytics
- System monitoring

---

**🎓 Your college library management system is ready for deployment!**

For additional support, refer to the detailed documentation or contact the development team. 