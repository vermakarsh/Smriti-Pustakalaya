# 📖 Database Scripts for Smriti Pustakalaya

This directory contains comprehensive database scripts for the Smriti Pustakalaya Library Management System.

## 📁 Available Scripts

### 1. `database-setup.js` - MongoDB Setup & Seeding
**Primary script for MongoDB database initialization and sample data seeding.**

#### Usage:
```bash
# Show help
node database-setup.js

# Initialize database with sample data
node database-setup.js init

# Reset database (clear all data)
node database-setup.js reset

# Show database statistics
node database-setup.js stats
```

#### Features:
- ✅ **Database Initialization**: Creates MongoDB connection and indexes
- ✅ **Sample Data Seeding**: Adds 8 Hindi literature books, 3 employees, 2 users
- ✅ **Data Validation**: Ensures proper data structure and relationships
- ✅ **Statistics Display**: Shows comprehensive database statistics
- ✅ **Error Handling**: Robust error handling and logging

#### Sample Data Includes:
- **📚 8 Books**: Ramayan, Mahabharat, Gita, Panchatantra, Kabir's Dohas, etc.
- **👥 3 Employees**: Librarian, Assistant, Volunteer
- **👤 2 Users**: Admin and Librarian accounts
- **🎁 8 Unique Donors**: Various donor profiles

### 2. `database-schema.sql` - SQL Schema Reference
**Complete SQL schema for reference or future SQL database migration.**

#### Features:
- ✅ **Complete Schema**: All tables, indexes, and relationships
- ✅ **Sample Data**: Pre-populated with Hindi literature
- ✅ **Stored Procedures**: For common operations like adding donations
- ✅ **Views**: For statistics and recent donations
- ✅ **Triggers**: For audit logging
- ✅ **Security**: User permissions and access control

#### Tables:
- `users` - Admin panel users
- `employees` - Mobile app employees
- `books` - Main donations table
- `donors` - Donor information
- `book_donors` - Many-to-many relationship
- `audit_log` - Change tracking

### 3. `database-backup.js` - Backup & Restore Utility
**MongoDB backup and restore functionality with file management.**

#### Usage:
```bash
# Show help
node database-backup.js

# Create backup
node database-backup.js backup

# Restore from backup
node database-backup.js restore backup-2024-01-15T10-30-00-000Z.json

# List available backups
node database-backup.js list

# Clean old backups (keep last 30 days)
node database-backup.js clean

# Clean old backups (keep last 7 days)
node database-backup.js clean 7
```

#### Features:
- ✅ **Automatic Backups**: Timestamped backup files
- ✅ **Complete Restore**: Full database restoration
- ✅ **Backup Management**: List, clean old backups
- ✅ **File Compression**: Efficient storage
- ✅ **Error Recovery**: Robust error handling

## 🚀 Quick Start Guide

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### Step 3: Initialize Database
```bash
# Initialize with sample data
node database-setup.js init
```

### Step 4: Verify Setup
```bash
# Check database statistics
node database-setup.js stats
```

## 📊 Database Structure

### MongoDB Collections

#### Books Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  isbn: String (unique, sparse),
  year: Number,
  genre: String,
  description: String,
  donators: [String], // Array of donor names
  destinationOfBook: String,
  status: String (pending/verified/rejected),
  donationDate: Date,
  image: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### Employees Collection
```javascript
{
  _id: ObjectId,
  employeeId: String (unique),
  name: String (required),
  email: String (unique),
  password: String (required),
  role: String (librarian/assistant/volunteer),
  phone: String,
  address: String,
  joinDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### Users Collection
```javascript
{
  _id: ObjectId,
  username: String (unique),
  email: String (unique),
  password: String (required),
  role: String (admin/librarian/assistant),
  name: String (required),
  phone: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Database Operations

### Adding New Donations
```javascript
// Via API
POST /api/books
{
  "title": "पुस्तक का नाम",
  "author": "लेखक का नाम",
  "isbn": "978-123-456-789",
  "genre": "Fiction",
  "donators": ["दाता का नाम"],
  "donationDate": "2024-01-15"
}
```

### Verifying Donations
```javascript
// Via API
POST /api/books/:id/verify
{
  "destinationOfBook": "मुख्य पुस्तकालय"
}
```

### Employee Login
```javascript
// Via API
POST /api/employees/login
{
  "email": "employee@library.com",
  "password": "password123"
}
```

## 📈 Sample Data Statistics

After running `node database-setup.js init`:

- **📚 Total Books**: 8
- **✅ Verified Books**: 5
- **⏳ Pending Books**: 3
- **👥 Total Employees**: 3
- **👤 Total Users**: 2
- **🎁 Unique Donors**: 8

## 🔒 Security Considerations

### Password Hashing
- All passwords should be hashed using bcrypt
- Never store plain text passwords
- Use environment variables for sensitive data

### Access Control
- Implement JWT tokens for authentication
- Role-based access control (admin, librarian, assistant)
- API rate limiting for production

### Data Validation
- Input validation on all API endpoints
- Sanitize user inputs
- Prevent SQL injection and NoSQL injection

## 🛠️ Maintenance

### Regular Backups
```bash
# Create daily backup
node database-backup.js backup

# Clean old backups (keep 30 days)
node database-backup.js clean 30
```

### Database Statistics
```bash
# Monitor database health
node database-setup.js stats
```

### Reset Database
```bash
# Clear all data (use with caution)
node database-setup.js reset
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in script
   - Verify network connectivity

2. **Permission Denied**
   - Check file permissions
   - Ensure write access to backup directory
   - Run with appropriate user privileges

3. **Duplicate Key Error**
   - Clear existing data: `node database-setup.js reset`
   - Check for existing data before seeding

4. **Memory Issues**
   - Large datasets may require more memory
   - Consider pagination for large queries
   - Optimize database indexes

### Logs and Debugging
- Check console output for detailed error messages
- Review MongoDB logs for connection issues
- Use `console.log()` for debugging in scripts

## 📞 Support

For database-related issues:
1. Check the troubleshooting section above
2. Review MongoDB documentation
3. Check script console output for error details
4. Verify all dependencies are installed

## 🔄 Migration Guide

### From SQL to MongoDB
1. Export data from SQL database
2. Transform data to MongoDB format
3. Use `database-setup.js` to initialize MongoDB
4. Import transformed data

### From MongoDB to SQL
1. Use `database-backup.js` to export MongoDB data
2. Transform JSON data to SQL format
3. Use `database-schema.sql` to create SQL database
4. Import transformed data

---

**📖 Smriti Pustakalaya Library Management System**  
**🔄 Database Scripts v1.0**  
**📅 Last Updated: January 2024** 