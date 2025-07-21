# Smriti Pustakalaya Backend (MySQL Version)

## Overview
Production-ready Node.js/Express backend API for the Smriti Pustakalaya Library Management System, now using MySQL database instead of MongoDB.

## Features
- ✅ **MySQL Database** with proper schema design
- ✅ **Employee Management** with authentication
- ✅ **Book Donation System** with complete CRUD operations
- ✅ **User Management** for library members
- ✅ **Database Backup & Restore** utility
- ✅ **RESTful API** endpoints
- ✅ **CORS enabled** for mobile app integration
- ✅ **Production logging** with Winston
- ✅ **Environment configuration**

## Technology Stack
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database (using mysql2)
- **Winston** - Logging
- **CORS** - Cross-origin requests
- **Dotenv** - Environment management

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL Server (v8.0 or higher)
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/vermakarsh/Smriti-Pustakalaya.git
cd backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup MySQL Database**
```bash
# Start MySQL service
# Windows: Start MySQL from Services
# Linux: sudo systemctl start mysql
# macOS: brew services start mysql

# Create database and tables
mysql -u root -p < mysql-schema.sql
```

4. **Configure environment variables**
```bash
# Edit database credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=smriti_pustakalaya
```

5. **Start the server**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Database Schema

### Tables
- **employees** - Staff members with login credentials
- **books** - Book donations with donor information
- **users** - Library members and students

### Default Login Credentials
- **Employee ID:** `user1`
- **Password:** `sml@2025`

## API Endpoints

### Authentication
- `POST /api/employees/login` - Employee login

### Books Management
- `GET /api/books` - Get all books
- `POST /api/books` - Add new book donation
- `PUT /api/books/:id/status` - Update book status
- `DELETE /api/books/:id` - Delete book

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Add new employee
- `DELETE /api/employees/:id` - Delete employee

### Health Check
- `GET /api/health` - Server status

## Database Operations

### Backup Database
```bash
node database-backup.js backup
```

### Restore from Backup
```bash
node database-backup.js restore backup-filename.json
```

### List Available Backups
```bash
node database-backup.js list
```

### Clean Old Backups
```bash
node database-backup.js clean 30  # Keep last 30 days
```

## Production Deployment

### Using PM2
```bash
npm install -g pm2
pm2 start src/app.js --name "smriti-backend"
pm2 save
pm2 startup
```

### Using Docker
```bash
docker build -t smriti-backend .
docker run -p 5000:5000 smriti-backend
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | MySQL host | localhost |
| `DB_USER` | MySQL username | root |
| `DB_PASSWORD` | MySQL password | (empty) |
| `DB_NAME` | Database name | smriti_pustakalaya |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | production |

## Project Structure
```
backend/
├── src/
│   ├── app.js              # Main application file
│   ├── models/             # Database models
│   │   ├── Book.js
│   │   ├── Employee.js
│   │   └── User.js
│   └── routes/             # API routes
│       ├── auth.js
│       ├── books.js
│       ├── employees.js
│       └── users.js
├── logs/                   # Application logs
├── backups/               # Database backups
├── mysql-schema.sql       # Database schema
├── database-backup.js     # Backup utility
└── package.json
```

## Security Features
- Input validation and sanitization
- CORS protection
- Environment-based configuration
- Secure password handling
- SQL injection prevention

## Monitoring & Logs
- **Winston logging** to files and console
- **Morgan HTTP** request logging
- **Error handling** middleware
- **Health check** endpoint

## Mobile App Integration
- CORS configured for React Native app
- RESTful API design
- JSON responses
- Error handling with proper HTTP status codes

## Support
For technical support or questions:
- GitHub Issues: [Repository Issues](https://github.com/vermakarsh/Smriti-Pustakalaya/issues)
- Documentation: See project wiki

---

**Note:** This backend is specifically designed for the Smriti Pustakalaya mobile app and admin panel. Make sure to configure your MySQL database properly before running the application.
