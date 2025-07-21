const mongoose = require('mongoose');
const Book = require('./src/models/Book');
const User = require('./src/models/User');
const Employee = require('./src/models/Employee');

// Database configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smriti-pustakalaya';

// Sample data for seeding
const sampleBooks = [
  {
    title: 'रामायण',
    author: 'वाल्मीकि',
    isbn: '978-81-291-1234-1',
    year: 2020,
    genre: 'Religious',
    description: 'प्राचीन भारतीय महाकाव्य',
    donators: ['राजेश कुमार'],
    destinationOfBook: 'मुख्य पुस्तकालय',
    status: 'verified',
    donationDate: new Date('2024-01-15')
  },
  {
    title: 'महाभारत',
    author: 'वेद व्यास',
    isbn: '978-81-291-1234-2',
    year: 2019,
    genre: 'Religious',
    description: 'भारतीय महाकाव्य',
    donators: ['सुनीता देवी'],
    destinationOfBook: 'मुख्य पुस्तकालय',
    status: 'verified',
    donationDate: new Date('2024-02-20')
  },
  {
    title: 'गीता',
    author: 'कृष्ण',
    isbn: '978-81-291-1234-3',
    year: 2021,
    genre: 'Religious',
    description: 'भगवद्गीता',
    donators: ['अमित शर्मा'],
    destinationOfBook: 'धार्मिक खंड',
    status: 'pending',
    donationDate: new Date('2024-03-10')
  },
  {
    title: 'पंचतंत्र',
    author: 'विष्णु शर्मा',
    isbn: '978-81-291-1234-4',
    year: 2018,
    genre: 'Children',
    description: 'बच्चों की कहानियां',
    donators: ['प्रिया वर्मा'],
    destinationOfBook: 'बाल खंड',
    status: 'verified',
    donationDate: new Date('2024-01-25')
  },
  {
    title: 'कबीर के दोहे',
    author: 'कबीर दास',
    isbn: '978-81-291-1234-5',
    year: 2022,
    genre: 'Poetry',
    description: 'कबीर के प्रसिद्ध दोहे',
    donators: ['राहुल गुप्ता'],
    destinationOfBook: 'कविता खंड',
    status: 'pending',
    donationDate: new Date('2024-03-15')
  },
  {
    title: 'तुलसीदास रामायण',
    author: 'तुलसीदास',
    isbn: '978-81-291-1234-6',
    year: 2020,
    genre: 'Religious',
    description: 'रामचरितमानस',
    donators: ['मीना यादव'],
    destinationOfBook: 'धार्मिक खंड',
    status: 'verified',
    donationDate: new Date('2024-02-05')
  },
  {
    title: 'सूरदास की सूरसागर',
    author: 'सूरदास',
    isbn: '978-81-291-1234-7',
    year: 2021,
    genre: 'Poetry',
    description: 'कृष्ण भक्ति काव्य',
    donators: ['दीपक सिंह'],
    destinationOfBook: 'कविता खंड',
    status: 'verified',
    donationDate: new Date('2024-01-30')
  },
  {
    title: 'मीराबाई के पद',
    author: 'मीराबाई',
    isbn: '978-81-291-1234-8',
    year: 2019,
    genre: 'Poetry',
    description: 'कृष्ण भक्ति पद',
    donators: ['अंजलि पटेल'],
    destinationOfBook: 'कविता खंड',
    status: 'pending',
    donationDate: new Date('2024-03-20')
  }
];

const sampleEmployees = [
  {
    userId: 'EMP001',
    name: 'राजेश कुमार',
    email: 'rajesh@library.com',
    password: 'password123',
    role: 'librarian'
  },
  {
    userId: 'EMP002',
    name: 'सुनीता देवी',
    email: 'sunita@library.com',
    password: 'password123',
    role: 'assistant'
  },
  {
    userId: 'EMP003',
    name: 'अमित शर्मा',
    email: 'amit@library.com',
    password: 'password123',
    role: 'volunteer'
  }
];

const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@library.com',
    password: 'admin123',
    role: 'admin',
    name: 'सिस्टम एडमिन',
    phone: '9876543200'
  },
  {
    username: 'librarian',
    email: 'librarian@library.com',
    password: 'librarian123',
    role: 'librarian',
    name: 'मुख्य लाइब्रेरियन',
    phone: '9876543201'
  }
];

// Database initialization function
async function initializeDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Book.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('✅ Existing data cleared');

    // Create indexes
    console.log('📊 Creating database indexes...');
    await Book.createIndexes();
    await Employee.createIndexes();
    await User.createIndexes();
    console.log('✅ Indexes created');

    // Seed sample data
    console.log('🌱 Seeding sample data...');
    
    // Insert books
    const insertedBooks = await Book.insertMany(sampleBooks);
    console.log(`✅ ${insertedBooks.length} books inserted`);

    // Insert employees
    const insertedEmployees = await Employee.insertMany(sampleEmployees);
    console.log(`✅ ${insertedEmployees.length} employees inserted`);

    // Insert users
    const insertedUsers = await User.insertMany(sampleUsers);
    console.log(`✅ ${insertedUsers.length} users inserted`);

    // Display summary
    console.log('\n📋 Database Setup Summary:');
    console.log('========================');
    console.log(`📚 Total Books: ${insertedBooks.length}`);
    console.log(`👥 Total Employees: ${insertedEmployees.length}`);
    console.log(`👤 Total Users: ${insertedUsers.length}`);
    
    // Show book statistics
    const verifiedBooks = insertedBooks.filter(book => book.status === 'verified').length;
    const pendingBooks = insertedBooks.filter(book => book.status === 'pending').length;
    console.log(`✅ Verified Books: ${verifiedBooks}`);
    console.log(`⏳ Pending Books: ${pendingBooks}`);
    
    // Show unique donors
    const uniqueDonors = new Set();
    insertedBooks.forEach(book => {
      if (book.donators && book.donators.length > 0) {
        book.donators.forEach(donor => uniqueDonors.add(donor));
      }
    });
    console.log(`🎁 Unique Donors: ${uniqueDonors.size}`);

    console.log('\n🎉 Database setup completed successfully!');
    console.log('🚀 Your library management system is ready to use.');

  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Function to reset database
async function resetDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Clear all data
    console.log('🧹 Clearing all data...');
    await Book.deleteMany({});
    await Employee.deleteMany({});
    await User.deleteMany({});
    console.log('✅ All data cleared');

    console.log('🎉 Database reset completed successfully!');

  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Function to show database statistics
async function showDatabaseStats() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB successfully');

    // Get statistics
    const totalBooks = await Book.countDocuments();
    const verifiedBooks = await Book.countDocuments({ status: 'verified' });
    const pendingBooks = await Book.countDocuments({ status: 'pending' });
    const totalEmployees = await Employee.countDocuments();
    const totalUsers = await User.countDocuments();

    // Get unique donors
    const books = await Book.find({});
    const uniqueDonors = new Set();
    books.forEach(book => {
      if (book.donators && book.donators.length > 0) {
        book.donators.forEach(donor => uniqueDonors.add(donor));
      }
    });

    console.log('\n📊 Database Statistics:');
    console.log('=====================');
    console.log(`📚 Total Books: ${totalBooks}`);
    console.log(`✅ Verified Books: ${verifiedBooks}`);
    console.log(`⏳ Pending Books: ${pendingBooks}`);
    console.log(`👥 Total Employees: ${totalEmployees}`);
    console.log(`👤 Total Users: ${totalUsers}`);
    console.log(`🎁 Unique Donors: ${uniqueDonors.size}`);

    // Show recent donations
    const recentDonations = await Book.find({})
      .sort({ donationDate: -1 })
      .limit(5);
    
    console.log('\n📅 Recent Donations:');
    console.log('==================');
    recentDonations.forEach((book, index) => {
      console.log(`${index + 1}. ${book.title} by ${book.author} (${book.donators?.[0] || 'Unknown'}) - ${book.status}`);
    });

  } catch (error) {
    console.error('❌ Failed to get database statistics:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'init':
    console.log('🚀 Initializing database...');
    initializeDatabase();
    break;
  case 'reset':
    console.log('🔄 Resetting database...');
    resetDatabase();
    break;
  case 'stats':
    console.log('📊 Getting database statistics...');
    showDatabaseStats();
    break;
  default:
    console.log('📖 Database Setup Script for Smriti Pustakalaya');
    console.log('==============================================');
    console.log('');
    console.log('Usage:');
    console.log('  node database-setup.js init   - Initialize database with sample data');
    console.log('  node database-setup.js reset  - Reset database (clear all data)');
    console.log('  node database-setup.js stats  - Show database statistics');
    console.log('');
    console.log('Sample data includes:');
    console.log('  📚 8 sample books (Hindi literature)');
    console.log('  👥 3 sample employees');
    console.log('  👤 2 sample users (admin & librarian)');
    console.log('');
    console.log('Make sure MongoDB is running before executing this script.');
    break;
} 