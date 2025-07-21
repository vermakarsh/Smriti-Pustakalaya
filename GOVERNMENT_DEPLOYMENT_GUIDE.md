# 🏛️ Government Server Deployment Guide - Smriti Pustakalaya

## 🎯 Overview
This guide is specifically designed for deploying the Smriti Pustakalaya Library Management System on government-provided servers.

## 📋 Government Server Requirements

### Server Specifications:
- **OS**: Linux (Ubuntu/CentOS) or Windows Server
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: 50GB+ SSD storage
- **Network**: Government network with static IP
- **Security**: Government security compliance

### Software Stack:
- **Node.js**: Version 16+ LTS
- **MongoDB**: Version 4.4+ (Community/Enterprise)
- **Nginx**: Reverse proxy and load balancer
- **PM2**: Process manager for Node.js
- **Docker**: Containerization (optional)

---

## 🚀 Deployment Options

### Option 1: Traditional Deployment (Recommended)
- Direct installation on government server
- Full control and customization
- Government security compliance
- Easy maintenance and updates

### Option 2: Containerized Deployment
- Docker-based deployment
- Consistent environment
- Easy scaling and updates
- Government container registry support

### Option 3: Cloud-Native Deployment
- Kubernetes deployment
- High availability
- Auto-scaling
- Government cloud platform

---

## 🔧 Government Server Setup

### 1. Server Access & Configuration

#### 1.1 SSH Access Setup
```bash
# Connect to government server
ssh username@government-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim htop
```

#### 1.2 Network Configuration
```bash
# Configure static IP (if needed)
sudo nano /etc/netplan/01-netcfg.yaml

# Configure firewall
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw allow 5000
```

### 2. Install Dependencies

#### 2.1 Install Node.js
```bash
# Install Node.js 18 LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### 2.2 Install MongoDB
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Install MongoDB
sudo apt update
sudo apt install -y mongodb-org

# Start and enable MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 2.3 Install Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

#### 2.4 Install PM2
```bash
# Install PM2 globally
sudo npm install -g pm2
```

---

## 📦 Application Deployment

### 1. Clone/Upload Application

#### Option A: Git Repository
```bash
# Clone from government repository
git clone https://government-repo-url/library-system.git
cd library-system
```

#### Option B: Upload Files
```bash
# Create application directory
sudo mkdir -p /opt/library-system
sudo chown $USER:$USER /opt/library-system

# Upload files via SCP or SFTP
scp -r ./library-system/* username@government-server-ip:/opt/library-system/
```

### 2. Backend Setup

```bash
cd /opt/library-system/backend

# Install dependencies
npm install --production

# Create environment file
cp production.env .env

# Update configuration for government server
sed -i 's/your-college-ip/government-server-ip/g' .env

# Initialize database
node database-setup.js init

# Test backend
npm start
```

### 3. Admin Panel Setup

```bash
cd /opt/library-system/smriti-pustakalaya

# Install dependencies
npm install

# Update API configuration
sed -i 's/localhost:5000/government-server-ip:5000/g' src/config/api.js

# Build for production
npm run build

# Test admin panel
npx serve -s build -l 3000
```

### 4. Mobile App Configuration

```bash
cd /opt/library-system/Library-Management

# Update API configuration
sed -i 's/localhost:5000/government-server-ip:5000/g' src/config/api.ts

# Build APK for government distribution
npx expo build:android --type apk
```

---

## 🔒 Government Security Configuration

### 1. SSL/TLS Certificate Setup

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-government-domain.gov.in

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Nginx Configuration

Create `/etc/nginx/sites-available/library-system`:
```nginx
server {
    listen 80;
    server_name your-government-domain.gov.in;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-government-domain.gov.in;

    ssl_certificate /etc/letsencrypt/live/your-government-domain.gov.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-government-domain.gov.in/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Admin Panel
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/library-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. MongoDB Security

```bash
# Enable MongoDB authentication
sudo nano /etc/mongod.conf

# Add security section:
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod

# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_government_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase"]
})
```

---

## 🚀 Production Deployment

### 1. PM2 Process Management

```bash
# Start backend with PM2
cd /opt/library-system/backend
pm2 start app.js --name "library-backend"

# Start admin panel with PM2
cd /opt/library-system/smriti-pustakalaya
pm2 start "npx serve -s build -l 3000" --name "library-admin"

# Save PM2 configuration
pm2 save
pm2 startup
```

### 2. Systemd Services (Alternative)

Create `/etc/systemd/system/library-backend.service`:
```ini
[Unit]
Description=Library Management Backend
After=network.target

[Service]
Type=simple
User=library-user
WorkingDirectory=/opt/library-system/backend
ExecStart=/usr/bin/node app.js
Restart=always
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

### 3. Monitoring Setup

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Setup log rotation
sudo nano /etc/logrotate.d/library-system

# Add configuration:
/opt/library-system/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 library-user library-user
}
```

---

## 📊 Government Compliance

### 1. Data Protection
- All data stored on government servers
- Regular backups to government storage
- Encryption at rest and in transit
- Access logging and audit trails

### 2. Security Measures
- Firewall configuration
- Intrusion detection system
- Regular security updates
- Vulnerability scanning

### 3. Monitoring & Reporting
- System health monitoring
- Performance metrics
- Usage statistics
- Compliance reports

---

## 🔄 Maintenance & Updates

### 1. Regular Maintenance

```bash
# System updates
sudo apt update && sudo apt upgrade -y

# Application updates
cd /opt/library-system
git pull origin main

# Restart services
pm2 restart all
```

### 2. Database Backup

```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/opt/backups/library-system"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mongodump --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/library-backup-$DATE.tar.gz $BACKUP_DIR/$DATE

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### 3. Health Checks

```bash
# Health check script
#!/bin/bash

# Check backend
if curl -f http://localhost:5000/api/health; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    pm2 restart library-backend
fi

# Check admin panel
if curl -f http://localhost:3000; then
    echo "Admin Panel: OK"
else
    echo "Admin Panel: FAILED"
    pm2 restart library-admin
fi

# Check MongoDB
if systemctl is-active --quiet mongod; then
    echo "MongoDB: OK"
else
    echo "MongoDB: FAILED"
    sudo systemctl restart mongod
fi
```

---

## 📞 Government Support

### Contact Information:
- **Technical Support**: government-it-support@domain.gov.in
- **Security Team**: security-team@domain.gov.in
- **System Administrator**: sysadmin@domain.gov.in

### Emergency Procedures:
1. **System Down**: Contact IT support immediately
2. **Security Breach**: Contact security team
3. **Data Loss**: Contact system administrator

---

## 🎉 Success Checklist

- [ ] Government server access configured
- [ ] All dependencies installed
- [ ] Application deployed successfully
- [ ] SSL certificate configured
- [ ] Security measures implemented
- [ ] Monitoring setup complete
- [ ] Backup system configured
- [ ] Government compliance verified
- [ ] User training completed
- [ ] Documentation submitted

---

**🏛️ Your government library management system is ready for deployment!**

For additional support, contact the government IT department or refer to the detailed documentation. 