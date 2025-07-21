#!/bin/bash

echo "========================================"
echo "   Government Server Deployment"
echo "========================================"
echo

echo "🏛️ Smriti Pustakalaya Library System"
echo "📦 Government Server Deployment Script"
echo

# Function to show menu
show_menu() {
    echo "Choose deployment option:"
    echo "1. Full System Setup (Recommended)"
    echo "2. Application Deployment Only"
    echo "3. Security Configuration"
    echo "4. Monitoring Setup"
    echo "5. Exit"
    echo
    read -p "Enter your choice (1-5): " choice
}

# Function for full system setup
full_setup() {
    echo
    echo "========================================"
    echo "    Full System Setup"
    echo "========================================"
    echo

    echo "📋 Prerequisites Check:"
    echo "- Root/sudo access required"
    echo "- Internet connection required"
    echo "- Government server IP configured"
    echo

    read -p "Enter government server IP: " server_ip
    read -p "Enter government domain (e.g., library.gov.in): " domain_name
    read -p "Enter admin email: " admin_email

    echo
    echo "🔧 Installing system dependencies..."
    echo

    # Update system
    sudo apt update && sudo apt upgrade -y

    # Install essential tools
    sudo apt install -y curl wget git vim htop ufw

    # Install Node.js
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs

    # Install MongoDB
    echo "🗄️ Installing MongoDB..."
    wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
    sudo apt update
    sudo apt install -y mongodb-org

    # Install Nginx
    echo "🌐 Installing Nginx..."
    sudo apt install -y nginx

    # Install PM2
    echo "⚡ Installing PM2..."
    sudo npm install -g pm2

    # Start and enable services
    sudo systemctl start mongod
    sudo systemctl enable mongod
    sudo systemctl start nginx
    sudo systemctl enable nginx

    # Configure firewall
    echo "🔥 Configuring firewall..."
    sudo ufw enable
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    sudo ufw allow 3000
    sudo ufw allow 5000

    echo "✅ System setup completed!"
    echo
}

# Function for application deployment
app_deployment() {
    echo
    echo "========================================"
    echo "    Application Deployment"
    echo "========================================"
    echo

    read -p "Enter government server IP: " server_ip
    read -p "Enter application directory (default: /opt/library-system): " app_dir
    app_dir=${app_dir:-/opt/library-system}

    echo
    echo "📦 Deploying application to $app_dir"
    echo

    # Create application directory
    sudo mkdir -p $app_dir
    sudo chown $USER:$USER $app_dir

    # Backend setup
    echo "🔧 Setting up backend..."
    cd $app_dir/backend

    # Install dependencies
    npm install --production

    # Create environment file
    cp production.env .env
    sed -i "s/your-college-ip/$server_ip/g" .env

    # Initialize database
    node database-setup.js init

    # Start with PM2
    pm2 start app.js --name "library-backend"

    # Admin panel setup
    echo "🌐 Setting up admin panel..."
    cd $app_dir/smriti-pustakalaya

    # Install dependencies
    npm install

    # Update API configuration
    sed -i "s/localhost:5000/$server_ip:5000/g" src/config/api.js

    # Build for production
    npm run build

    # Start with PM2
    pm2 start "npx serve -s build -l 3000" --name "library-admin"

    # Save PM2 configuration
    pm2 save
    pm2 startup

    echo "✅ Application deployment completed!"
    echo
}

# Function for security configuration
security_setup() {
    echo
    echo "========================================"
    echo "    Security Configuration"
    echo "========================================"
    echo

    read -p "Enter government domain (e.g., library.gov.in): " domain_name
    read -p "Enter admin email: " admin_email

    echo
    echo "🔒 Configuring security..."
    echo

    # Install SSL certificate
    echo "🔐 Installing SSL certificate..."
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $domain_name --email $admin_email --agree-tos --non-interactive

    # Configure Nginx
    echo "🌐 Configuring Nginx..."
    sudo tee /etc/nginx/sites-available/library-system > /dev/null <<EOF
server {
    listen 80;
    server_name $domain_name;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $domain_name;

    ssl_certificate /etc/letsencrypt/live/$domain_name/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$domain_name/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Admin Panel
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

    # Enable site
    sudo ln -sf /etc/nginx/sites-available/library-system /etc/nginx/sites-enabled/
    sudo nginx -t
    sudo systemctl reload nginx

    # Configure MongoDB security
    echo "🗄️ Configuring MongoDB security..."
    sudo tee -a /etc/mongod.conf > /dev/null <<EOF

security:
  authorization: enabled
EOF

    sudo systemctl restart mongod

    echo "✅ Security configuration completed!"
    echo
}

# Function for monitoring setup
monitoring_setup() {
    echo
    echo "========================================"
    echo "    Monitoring Setup"
    echo "========================================"
    echo

    echo "📊 Setting up monitoring..."
    echo

    # Install monitoring tools
    sudo apt install -y htop iotop nethogs

    # Setup log rotation
    sudo tee /etc/logrotate.d/library-system > /dev/null <<EOF
/opt/library-system/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
}
EOF

    # Create health check script
    sudo tee /opt/library-system/health-check.sh > /dev/null <<'EOF'
#!/bin/bash

# Check backend
if curl -f http://localhost:5000/api/books > /dev/null 2>&1; then
    echo "$(date): Backend: OK"
else
    echo "$(date): Backend: FAILED"
    pm2 restart library-backend
fi

# Check admin panel
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "$(date): Admin Panel: OK"
else
    echo "$(date): Admin Panel: FAILED"
    pm2 restart library-admin
fi

# Check MongoDB
if systemctl is-active --quiet mongod; then
    echo "$(date): MongoDB: OK"
else
    echo "$(date): MongoDB: FAILED"
    sudo systemctl restart mongod
fi
EOF

    sudo chmod +x /opt/library-system/health-check.sh

    # Setup cron job for health checks
    (crontab -l 2>/dev/null; echo "*/5 * * * * /opt/library-system/health-check.sh >> /opt/library-system/logs/health.log 2>&1") | crontab -

    # Setup SSL renewal
    (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -

    echo "✅ Monitoring setup completed!"
    echo
}

# Main menu loop
while true; do
    show_menu
    
    case $choice in
        1)
            full_setup
            app_deployment
            security_setup
            monitoring_setup
            ;;
        2)
            app_deployment
            ;;
        3)
            security_setup
            ;;
        4)
            monitoring_setup
            ;;
        5)
            echo
            echo "👋 Thank you for using Smriti Pustakalaya!"
            echo "🏛️ Government deployment completed!"
            echo
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    read -p "Press Enter to continue..."
done 