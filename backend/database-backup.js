const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smriti_pustakalaya'
};

const BACKUP_DIR = path.join(__dirname, 'backups');

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Function to create backup
async function createBackup() {
  let connection;
  try {
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL successfully');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupData = {
      timestamp: new Date().toISOString(),
      books: [],
      employees: [],
      users: []
    };

    // Backup books
    console.log('📚 Backing up books...');
    const [books] = await connection.execute('SELECT * FROM books');
    backupData.books = books;
    console.log(`✅ ${books.length} books backed up`);

    // Backup employees
    console.log('👥 Backing up employees...');
    const [employees] = await connection.execute('SELECT * FROM employees');
    backupData.employees = employees;
    console.log(`✅ ${employees.length} employees backed up`);

    // Backup users
    console.log('👤 Backing up users...');
    const [users] = await connection.execute('SELECT * FROM users');
    backupData.users = users;
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
    if (connection) {
      await connection.end();
      console.log('🔌 Disconnected from MySQL');
    }
  }
}

// Function to restore from backup
async function restoreFromBackup(backupFile) {
  let connection;
  try {
    console.log('🔄 Connecting to MySQL...');
    connection = await mysql.createConnection(DB_CONFIG);
    console.log('✅ Connected to MySQL successfully');

    // Read backup file
    if (!fs.existsSync(backupFile)) {
      throw new Error(`Backup file not found: ${backupFile}`);
    }

    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf8'));
    console.log(`📅 Restoring from backup: ${backupData.timestamp}`);

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await connection.execute('DELETE FROM books');
    await connection.execute('DELETE FROM employees');
    await connection.execute('DELETE FROM users');
    console.log('✅ Existing data cleared');

    // Restore books
    if (backupData.books && backupData.books.length > 0) {
      console.log('📚 Restoring books...');
      for (const book of backupData.books) {
        await connection.execute(
          `INSERT INTO books (title, author, isbn, genre, condition_status, donor_name, donor_mobile, donor_address, donation_date, image_url, status, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [book.title, book.author, book.isbn, book.genre, book.condition_status, book.donor_name, book.donor_mobile, book.donor_address, book.donation_date, book.image_url, book.status, book.created_at, book.updated_at]
        );
      }
      console.log(`✅ ${backupData.books.length} books restored`);
    }

    // Restore employees
    if (backupData.employees && backupData.employees.length > 0) {
      console.log('👥 Restoring employees...');
      for (const employee of backupData.employees) {
        await connection.execute(
          `INSERT INTO employees (employee_id, name, email, phone, department, designation, password, is_active, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [employee.employee_id, employee.name, employee.email, employee.phone, employee.department, employee.designation, employee.password, employee.is_active, employee.created_at, employee.updated_at]
        );
      }
      console.log(`✅ ${backupData.employees.length} employees restored`);
    }

    // Restore users
    if (backupData.users && backupData.users.length > 0) {
      console.log('👤 Restoring users...');
      for (const user of backupData.users) {
        await connection.execute(
          `INSERT INTO users (name, email, phone, address, user_type, membership_id, is_active, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [user.name, user.email, user.phone, user.address, user.user_type, user.membership_id, user.is_active, user.created_at, user.updated_at]
        );
      }
      console.log(`✅ ${backupData.users.length} users restored`);
    }

    console.log('🎉 Restore completed successfully!');

  } catch (error) {
    console.error('❌ Restore failed:', error);
    throw error;
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Disconnected from MySQL');
    }
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