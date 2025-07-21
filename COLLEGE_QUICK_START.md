# 🏫 College Server Quick Start Guide

## 🎯 Your College Server Setup
Since your college server already has **Node.js installed**, we can deploy the library system quickly!

## 🚀 Quick Deployment Steps

### **Step 1: Upload Files to Server**
Upload all project files to your college server (via SCP, SFTP, or Git)

### **Step 2: Run Deployment Script**
```bash
# Make script executable
chmod +x deploy-college-nodejs.sh

# Run deployment
./deploy-college-nodejs.sh
```

### **Step 3: Choose Deployment Option**
Select **Option 1: Full Application Deployment** for complete setup

### **Step 4: Enter Server Details**
- **College Server IP**: Your server's IP address
- **Application Directory**: `/opt/library-system` (default)

## 📋 What the Script Will Do

### ✅ **Automatic Setup**
- Check Node.js installation ✓
- Install MongoDB (if not present)
- Create application directories
- Install all dependencies
- Configure environment variables
- Initialize database with sample data
- Start services with PM2

### 🌐 **Access URLs**
After deployment, you'll have:
- **Admin Panel**: `http://your-college-ip:3000`
- **Backend API**: `http://your-college-ip:5000`

## 📱 Mobile App Setup

### **Option 1: Build APK**
```bash
# Run the deployment script and choose Option 4
./deploy-college-nodejs.sh
# Choose: 4. Mobile App Build
```

### **Option 2: QR Code Distribution**
```bash
cd Library-Management
npx expo start
# Share QR code with college employees
```

## 🔧 Manual Steps (if needed)

### **1. Install PM2 (if not installed)**
```bash
sudo npm install -g pm2
```

### **2. Install MongoDB (if not installed)**
```bash
# The script will do this automatically
# But if you need to do it manually:
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

### **3. Configure Firewall**
```bash
sudo ufw allow 3000  # Admin panel
sudo ufw allow 5000  # Backend API
```

## 📊 System Status Check

### **Check if services are running**
```bash
# Check PM2 processes
pm2 status

# Check MongoDB
sudo systemctl status mongod

# Check ports
netstat -tlnp | grep -E ':(3000|5000)'
```

### **View logs**
```bash
# Backend logs
pm2 logs library-backend

# Admin panel logs
pm2 logs library-admin

# MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

## 🔄 Maintenance Commands

### **Restart Services**
```bash
pm2 restart all
```

### **Update Application**
```bash
cd /opt/library-system
git pull origin main
pm2 restart all
```

### **Database Backup**
```bash
cd /opt/library-system/backend
node database-backup.js backup
```

## 🆘 Troubleshooting

### **Port Already in Use**
```bash
# Find process using port
sudo netstat -tlnp | grep :5000
# Kill process
sudo kill -9 <PID>
```

### **MongoDB Connection Failed**
```bash
# Start MongoDB
sudo systemctl start mongod

# Check status
sudo systemctl status mongod
```

### **PM2 Process Not Starting**
```bash
# Check PM2 logs
pm2 logs

# Restart PM2
pm2 kill
pm2 start all
```

## 📞 Support

### **Quick Commands**
```bash
# System status
pm2 status && sudo systemctl status mongod

# View all logs
pm2 logs --lines 50

# Restart everything
pm2 restart all && sudo systemctl restart mongod
```

### **Database Management**
```bash
# View database stats
cd /opt/library-system/backend
node database-setup.js stats

# Reset database
node database-setup.js reset

# Initialize database
node database-setup.js init
```

---

## 🎉 **Ready to Deploy!**

Your college server is ready for the Smriti Pustakalaya Library Management System!

**Next Steps:**
1. Upload files to server
2. Run `./deploy-college-nodejs.sh`
3. Choose full deployment
4. Access admin panel at `http://your-college-ip:3000`
5. Build mobile app for employees

**Expected Time:** 10-15 minutes for complete deployment

For any issues, check the troubleshooting section or refer to the detailed documentation. 