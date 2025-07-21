#!/bin/bash

echo "========================================"
echo "   Smriti Pustakalaya Deployment"
echo "========================================"
echo

echo "🏫 College Library Management System"
echo "📦 Deployment Script for Linux"
echo

# Function to show menu
show_menu() {
    echo "Choose deployment option:"
    echo "1. Local Network Deployment"
    echo "2. Docker Deployment"
    echo "3. Cloud Deployment (AWS)"
    echo "4. Exit"
    echo
    read -p "Enter your choice (1-4): " choice
}

# Function for local deployment
local_deployment() {
    echo
    echo "========================================"
    echo "    Local Network Deployment"
    echo "========================================"
    echo

    echo "📋 Prerequisites Check:"
    echo "- Node.js installed"
    echo "- MongoDB installed"
    echo "- Network access configured"
    echo

    read -p "Enter your college server IP: " server_ip
    read -p "Enter admin panel port (default 3000): " admin_port
    admin_port=${admin_port:-3000}

    echo
    echo "🔧 Configuring for IP: $server_ip"
    echo

    # Backend setup
    echo "Updating backend configuration..."
    cd backend
    cp production.env .env
    sed -i "s/your-college-ip/$server_ip/g" .env

    echo "Installing backend dependencies..."
    npm install

    echo "Initializing database..."
    node database-setup.js init

    echo "Starting backend server..."
    nohup npm start > ../logs/backend.log 2>&1 &
    echo "Backend started with PID: $!"

    cd ..

    # Admin panel setup
    echo
    echo "🌐 Updating admin panel configuration..."
    cd smriti-pustakalaya
    sed -i "s/localhost:5000/$server_ip:5000/g" src/config/api.js

    echo "Installing admin panel dependencies..."
    npm install

    echo "Building admin panel..."
    npm run build

    echo "Starting admin panel..."
    nohup npx serve -s build -l $admin_port > ../logs/admin.log 2>&1 &
    echo "Admin panel started with PID: $!"

    cd ..

    echo
    echo "📱 Mobile App Configuration:"
    echo "Update Library-Management/src/config/api.ts with:"
    echo "export const API_BASE_URL = 'http://$server_ip:5000/api';"
    echo

    echo "✅ Local deployment completed!"
    echo
    echo "🌐 Access URLs:"
    echo "- Admin Panel: http://$server_ip:$admin_port"
    echo "- Backend API: http://$server_ip:5000"
    echo
}

# Function for Docker deployment
docker_deployment() {
    echo
    echo "========================================"
    echo "    Docker Deployment"
    echo "========================================"
    echo

    echo "📋 Prerequisites Check:"
    echo "- Docker installed"
    echo "- Docker Compose installed"
    echo

    read -p "Enter your college server IP: " server_ip

    echo
    echo "🐳 Building and starting containers..."
    docker-compose up -d

    echo
    echo "✅ Docker deployment completed!"
    echo
    echo "🌐 Access URLs:"
    echo "- Admin Panel: http://$server_ip:3000"
    echo "- Backend API: http://$server_ip:5000"
    echo
}

# Function for cloud deployment
cloud_deployment() {
    echo
    echo "========================================"
    echo "    Cloud Deployment (AWS)"
    echo "========================================"
    echo

    echo "📋 Prerequisites Check:"
    echo "- AWS CLI installed and configured"
    echo "- EC2 instance running"
    echo "- Security groups configured"
    echo

    echo "🚀 This will guide you through AWS deployment..."
    echo
    echo "1. Launch EC2 instance (Ubuntu 20.04)"
    echo "2. Configure security groups (ports 22, 80, 443, 3000, 5000)"
    echo "3. Connect via SSH"
    echo "4. Run deployment commands"
    echo

    echo "📝 Deployment commands for EC2:"
    echo
    echo "# Install dependencies"
    echo "sudo apt update"
    echo "sudo apt install -y nodejs npm mongodb docker.io docker-compose"
    echo
    echo "# Clone repository"
    echo "git clone your-repo-url"
    echo "cd library-system"
    echo
    echo "# Deploy with Docker"
    echo "sudo docker-compose up -d"
    echo
    echo "# Or deploy manually"
    echo "cd backend && npm install && npm start"
    echo "cd ../smriti-pustakalaya && npm install && npm run build && npx serve -s build -l 3000"
    echo
}

# Main menu loop
while true; do
    show_menu
    
    case $choice in
        1)
            local_deployment
            ;;
        2)
            docker_deployment
            ;;
        3)
            cloud_deployment
            ;;
        4)
            echo
            echo "👋 Thank you for using Smriti Pustakalaya!"
            echo "🎓 Good luck with your college deployment!"
            echo
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
    
    read -p "Press Enter to continue..."
done 