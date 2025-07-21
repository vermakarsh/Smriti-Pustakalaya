#!/bin/bash

echo "========================================"
echo "   College Server Deployment"
echo "========================================"
echo

echo "🏫 Smriti Pustakalaya Library System"
echo "📦 Deployment for College Server (Node.js Pre-installed)"
echo

# Function to show menu
show_menu() {
    echo "Choose deployment option:"
    echo "1. Full Application Deployment (Recommended)"
    echo "2. Backend Only"
    echo "3. Admin Panel Only"
    echo "4. Mobile App Build"
    echo "5. Database Setup"
    echo "6. Exit"
    echo
    read -p "Enter your choice (1-6): " choice
}

# Function for full application deployment
full_deployment() {
    echo
    echo "========================================"
    echo "    Full Application Deployment"
    echo "========================================"
    echo

    echo "📋 Prerequisites Check:"
    echo "- Node.js installed ✓"
    echo "- MongoDB installed (if not, will install)"
    echo "- Network access configured"
    echo

    read -p "Enter college server IP: " server_ip
    read -p "Enter application directory (default: /opt/library-system): " app_dir
    app_dir=${app_dir:-/opt/library-system}

    echo
    echo "🔧 Deploying to $app_dir"
    echo

    # Create application directory
    sudo mkdir -p $app_dir
    sudo chown $USER:$USER $app_dir

    # Check if MongoDB is installed
    if ! command -v mongod &> /dev/null; then
        echo "🗄️ Installing MongoDB..."
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt update
        sudo apt install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
    else
        echo "🗄️ MongoDB already installed"
        sudo systemctl start mongod
    fi

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

    echo "✅ Full deployment completed!"
    echo
    echo "🌐 Access URLs:"
    echo "- Admin Panel: http://$server_ip:3000"
    echo "- Backend API: http://$server_ip:5000"
    echo
}

# Function for backend only
backend_only() {
    echo
    echo "========================================"
    echo "    Backend Deployment"
    echo "========================================"
    echo

    read -p "Enter college server IP: " server_ip
    read -p "Enter application directory (default: /opt/library-system): " app_dir
    app_dir=${app_dir:-/opt/library-system}

    echo
    echo "🔧 Setting up backend..."
    echo

    # Create directory
    sudo mkdir -p $app_dir/backend
    sudo chown $USER:$USER $app_dir/backend
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
    pm2 save

    echo "✅ Backend deployment completed!"
    echo "🌐 Backend API: http://$server_ip:5000"
    echo
}

# Function for admin panel only
admin_only() {
    echo
    echo "========================================"
    echo "    Admin Panel Deployment"
    echo "========================================"
    echo

    read -p "Enter college server IP: " server_ip
    read -p "Enter application directory (default: /opt/library-system): " app_dir
    app_dir=${app_dir:-/opt/library-system}

    echo
    echo "🌐 Setting up admin panel..."
    echo

    # Create directory
    sudo mkdir -p $app_dir/smriti-pustakalaya
    sudo chown $USER:$USER $app_dir/smriti-pustakalaya
    cd $app_dir/smriti-pustakalaya

    # Install dependencies
    npm install

    # Update API configuration
    sed -i "s/localhost:5000/$server_ip:5000/g" src/config/api.js

    # Build for production
    npm run build

    # Start with PM2
    pm2 start "npx serve -s build -l 3000" --name "library-admin"
    pm2 save

    echo "✅ Admin panel deployment completed!"
    echo "🌐 Admin Panel: http://$server_ip:3000"
    echo
}

# Function for mobile app build
mobile_build() {
    echo
    echo "========================================"
    echo "    Mobile App Build"
    echo "========================================"
    echo

    read -p "Enter college server IP: " server_ip
    read -p "Enter app name (default: Smriti Pustakalaya): " app_name
    app_name=${app_name:-Smriti Pustakalaya}

    echo
    echo "📱 Building mobile app..."
    echo

    cd Library-Management

    # Update API configuration
    sed -i "s/localhost:5000/$server_ip:5000/g" src/config/api.ts

    # Update app configuration
    sed -i "s/Smriti Pustakalaya/$app_name/g" app.json

    # Install dependencies
    npm install

    # Build APK
    echo "🏗️ Building APK (this may take several minutes)..."
    npx expo build:android --type apk

    echo "✅ Mobile app build completed!"
    echo "📱 Download APK from Expo dashboard"
    echo "🌐 Server URL: http://$server_ip:5000"
    echo
}

# Function for database setup
database_setup() {
    echo
    echo "========================================"
    echo "    Database Setup"
    echo "========================================"
    echo

    read -p "Enter application directory (default: /opt/library-system): " app_dir
    app_dir=${app_dir:-/opt/library-system}

    echo
    echo "🗄️ Setting up database..."
    echo

    # Check if MongoDB is installed
    if ! command -v mongod &> /dev/null; then
        echo "🗄️ Installing MongoDB..."
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt update
        sudo apt install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
    else
        echo "🗄️ MongoDB already installed"
        sudo systemctl start mongod
    fi

    # Initialize database
    cd $app_dir/backend
    node database-setup.js init

    echo "✅ Database setup completed!"
    echo
}

# Main menu loop
while true; do
    show_menu
    
    case $choice in
        1)
            full_deployment
            ;;
        2)
            backend_only
            ;;
        3)
            admin_only
            ;;
        4)
            mobile_build
            ;;
        5)
            database_setup
            ;;
        6)
            echo
            echo "👋 Thank you for using Smriti Pustakalaya!"
            echo "🏫 College deployment completed!"
            echo
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    read -p "Press Enter to continue..."
done 