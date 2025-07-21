# 🏫 College Library Management System - Deployment Guide

## 📋 Overview
This guide will help you deploy the Smriti Pustakalaya Library Management System to your college network.

## 🎯 System Components
- **Backend API**: Node.js/Express server
- **Admin Panel**: React web application
- **Mobile App**: React Native for employees
- **Database**: MongoDB

## 🚀 Deployment Options

### Option 1: Local College Network (Recommended)
Deploy on a college computer/server accessible via local network.

### Option 2: Cloud Deployment
Deploy on cloud platforms like AWS, Azure, or Heroku.

### Option 3: Docker Deployment
Containerized deployment for easy management.

---

## 📦 Option 1: Local College Network Deployment

### Prerequisites
- Windows/Linux server or dedicated computer
- Node.js 16+ installed
- MongoDB installed
- Network access for all users

### Step 1: Server Setup

#### 1.1 Install Dependencies
```bash
# Install Node.js from https://nodejs.org/
# Install MongoDB from https://www.mongodb.com/try/download/community

# Verify installations
node --version
npm --version
mongod --version
```

#### 1.2 Clone/Download Project
```bash
# Download the project to your server
# Extract to: C:\LibrarySystem\ or /opt/library-system/
```

#### 1.3 Install Backend Dependencies
```bash
cd backend
npm install
```

#### 1.4 Install Admin Panel Dependencies
```bash
cd ../smriti-pustakalaya
npm install
```

### Step 2: Database Configuration

#### 2.1 Start MongoDB
```bash
# Windows
mongod --dbpath C:\data\db

# Linux
sudo systemctl start mongod
```

#### 2.2 Initialize Database
```bash
cd backend
node database-setup.js init
```

### Step 3: Backend Configuration

#### 3.1 Update Environment Variables
Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_college_secret_key_here
NODE_ENV=production
```

#### 3.2 Update CORS Settings
Edit `backend/src/app.js`:
```javascript
app.use(cors({
  origin: [
    'http://your-college-ip:3000',  // Admin panel
    'http://your-college-ip:8081',  // Mobile app
    'http://localhost:3000',
    'http://localhost:8081'
  ],
  credentials: true
}));
```

### Step 4: Admin Panel Configuration

#### 4.1 Update API URL
Edit `smriti-pustakalaya/src/config/api.js`:
```javascript
const API_BASE_URL = 'http://your-college-ip:5000/api';
```

#### 4.2 Build for Production
```bash
cd smriti-pustakalaya
npm run build
```

### Step 5: Mobile App Configuration

#### 5.1 Update API URL
Edit `Library-Management/src/config/api.ts`:
```typescript
export const API_BASE_URL = 'http://your-college-ip:5000/api';
```

#### 5.2 Build APK
```bash
cd Library-Management
npx expo build:android
```

### Step 6: Start Services

#### 6.1 Start Backend (Production)
```bash
cd backend
npm start
```

#### 6.2 Serve Admin Panel
```bash
cd smriti-pustakalaya
npx serve -s build -l 3000
```

---

## ☁️ Option 2: Cloud Deployment

### AWS Deployment

#### 2.1 EC2 Instance Setup
```bash
# Launch EC2 instance (Ubuntu 20.04)
# Connect via SSH
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 2.2 Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm mongodb
```

#### 2.3 Deploy Application
```bash
# Clone your repository
git clone your-repo-url
cd library-system

# Install dependencies
cd backend && npm install
cd ../smriti-pustakalaya && npm install

# Build admin panel
npm run build
```

#### 2.4 Configure PM2 (Process Manager)
```bash
sudo npm install -g pm2

# Start backend
cd backend
pm2 start app.js --name "library-backend"

# Start admin panel
cd ../smriti-pustakalaya
pm2 start "npx serve -s build -l 3000" --name "library-admin"

# Save PM2 configuration
pm2 save
pm2 startup
```

---

## 🐳 Option 3: Docker Deployment

### 3.1 Create Dockerfile for Backend
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 3.2 Create Dockerfile for Admin Panel
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

### 3.3 Create docker-compose.yml
```yaml
version: '3.8'
services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/library_management

  admin-panel:
    build: ./smriti-pustakalaya
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

### 3.4 Deploy with Docker
```bash
docker-compose up -d
```

---

## 🔧 Configuration Files

### Production Environment Variables
Create `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library_management
JWT_SECRET=your_very_secure_secret_key_here
NODE_ENV=production
CORS_ORIGIN=http://your-college-ip:3000
```

### Nginx Configuration (Optional)
Create `/etc/nginx/sites-available/library-system`:
```nginx
server {
    listen 80;
    server_name your-college-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📱 Mobile App Distribution

### Android APK Distribution
1. Build APK: `npx expo build:android`
2. Download APK from Expo dashboard
3. Share APK file with college employees
4. Install on employee devices

### Alternative: QR Code Installation
1. Start Expo development server
2. Share QR code with employees
3. Employees scan with Expo Go app

---

## 🔒 Security Considerations

### 1. Network Security
- Use HTTPS in production
- Configure firewall rules
- Restrict access to college network

### 2. Database Security
- Use strong passwords
- Enable MongoDB authentication
- Regular backups

### 3. Application Security
- Use environment variables for secrets
- Implement rate limiting
- Regular security updates

---

## 📊 Monitoring & Maintenance

### 1. Logs
```bash
# Backend logs
pm2 logs library-backend

# Admin panel logs
pm2 logs library-admin
```

### 2. Database Backup
```bash
# Create backup
node database-backup.js backup

# Restore backup
node database-backup.js restore backup-2024-01-20.json
```

### 3. Performance Monitoring
- Monitor server resources
- Check database performance
- Review application logs

---

## 🆘 Troubleshooting

### Common Issues

#### 1. Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :5000
# Kill process
taskkill /PID <process_id> /F
```

#### 2. MongoDB Connection Failed
```bash
# Check MongoDB status
sudo systemctl status mongod
# Start MongoDB
sudo systemctl start mongod
```

#### 3. CORS Errors
- Verify CORS configuration in backend
- Check API URL in frontend
- Ensure correct port numbers

#### 4. Mobile App Can't Connect
- Verify server IP address
- Check network connectivity
- Ensure firewall allows connections

---

## 📞 Support

For deployment issues:
1. Check logs for error messages
2. Verify all dependencies are installed
3. Ensure correct configuration
4. Test network connectivity

---

## 🎉 Success Checklist

- [ ] Backend server running on port 5000
- [ ] Admin panel accessible on port 3000
- [ ] Database initialized with sample data
- [ ] Mobile app can connect to backend
- [ ] All users can access the system
- [ ] Backup system configured
- [ ] Security measures implemented

---

**🎓 Your college library management system is now ready for deployment!** 