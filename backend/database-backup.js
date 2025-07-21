const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Book = require('./src/models/Book');
const User = require('./src/models/User');
const Employee = require('./src/models/Employee');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smriti-pustakalaya';
const BACKUP_DIR = path.join(__dirname, 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to create backup
async function createBackup() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      timestamp: new Date().toISOString(),
      books: [],
      employees: [],
      users: []
    };

    // Backup books
    console.log('📚 Backing up books...');
    const books = await Book.find({});
    backupData.books = books.map(book => book.toObject());
    console.log(`✅ ${books.length} books backed up`);

    // Backup employees
    console.log('👥 Backing up employees...');
    const employees = await Employee.find({});
    backupData.employees = employees.map(emp => emp.toObject());
    console.log(`✅ ${employees.length} employees backed up`);

    // Backup users
    console.log('👤 Backing up users...');
    const users = await User.find({});
    backupData.users = users.map(user => user.toObject());
    console.log(`✅ ${users.length} users backed up`);

    // Save backup to file
    const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.json`);
    fs.writeFileSync(backupFile, JSON.stringify(backupData, null, 2));
    
    console.log(`💾 Backup saved to: ${backupFile}`);
    console.log('🎉 Backup completed successfully!');

    return backupFile;

  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Function to restore from backup
async function restoreFromBackup(backupFile) {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Read backup file
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Restoring from backup: ${backupData.timestamp}`);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Book.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared');

    // Restore books
    if (backupData.books && backupData.books.length > 0) {
      console.log('📚 Restoring books...');
      await Book.insertMany(backupData.books);
      console.log(`✅ ${backupData.books.length} books restored`);
    }

    // Restore employees
    if (backupData.employees && backupData.employees.length > 0) {
      console.log('👥 Restoring employees...');
      await Employee.insertMany(backupData.employees);
      console.log(`✅ ${backupData.employees.length} employees restored`);
    }

    // Restore users
    if (backupData.users && backupData.users.length > 0) {
      console.log('👤 Restoring users...');
      await User.insertMany(backupData.users);
      console.log(`✅ ${backupData.users.length} users restored`);
    }

    console.log('🎉 Restore completed successfully!');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Function to list available backups
function listBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));
    
    if (backupFiles.length === 0) {
      console.log('📁 No backup files found');
      return [];
    }

    console.log('📁 Available backups:');
    console.log('=====================');
    
    backupFiles.forEach((file, index) => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      const fileSize = (stats.size / 1024).toFixed(2); // KB
      
      try {
        const backupData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`${index + 1}. ${file}`);
        console.log(`   📅 Date: ${backupData.timestamp}`);
        console.log(`   📚 Books: ${backupData.books?.length || 0}`);
        console.log(`   👥 Employees: ${backupData.employees?.length || 0}`);
        console.log(`   👤 Users: ${backupData.users?.length || 0}`);
        console.log(`   💾 Size: ${fileSize} KB`);
        console.log('');
      } catch (error) {
        console.log(`${index + 1}. ${file} (corrupted)`);
      }
    });

    return backupFiles;
  } catch (error) {
    console.error('❌ Failed to list backups:', error);
    return [];
  }
}

// Function to clean old backups
async function cleanOldBackups(daysToKeep = 30) {
  try {
    const files = fs.readdirSync(BACKUP_DIR);
    const backupFiles = files.filter(file => file.startsWith('backup-') && file.endsWith('.json'));
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    
    let deletedCount = 0;
    
    backupFiles.forEach(file => {
      const filePath = path.join(BACKUP_DIR, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ Deleted old backup: ${file}`);
        deletedCount++;
      }
    });
    
    if (deletedCount === 0) {
      console.log('✨ No old backups to clean');
    } else {
      console.log(`🧹 Cleaned ${deletedCount} old backup files`);
    }
    
  } catch (error) {
    console.error('❌ Failed to clean old backups:', error);
  }
}

// Command line interface
const command = process.argv[2];
const backupFile = process.argv[3];

switch (command) {
  case 'backup':
    console.log('💾 Creating database backup...');
    createBackup();
    break;
    
  case 'restore':
    if (!backupFile) {
      console.log('❌ Please specify a backup file to restore from');
      console.log('Usage: node database-backup.js restore <backup-file>');
      break;
    }
    console.log('🔄 Restoring from backup...');
    restoreFromBackup(backupFile);
    break;
    
  case 'list':
    console.log('📁 Listing available backups...');
    listBackups();
    break;
    
  case 'clean':
    const days = parseInt(process.argv[3]) || 30;
    console.log(`🧹 Cleaning backups older than ${days} days...`);
    cleanOldBackups(days);
    break;
    
  default:
    console.log('💾 Database Backup & Restore Utility');
    console.log('====================================');
    console.log('');
    console.log('Usage:');
    console.log('  node database-backup.js backup                    - Create a new backup');
    console.log('  node database-backup.js restore <backup-file>     - Restore from backup');
    console.log('  node database-backup.js list                      - List available backups');
    console.log('  node database-backup.js clean [days]              - Clean old backups (default: 30 days)');
    console.log('');
    console.log('Examples:');
    console.log('  node database-backup.js backup');
    console.log('  node database-backup.js restore backup-2024-01-15T10-30-00-000Z.json');
    console.log('  node database-backup.js list');
    console.log('  node database-backup.js clean 7');
    console.log('');
    console.log('Backup files are stored in: ./backups/');
    break;
} 