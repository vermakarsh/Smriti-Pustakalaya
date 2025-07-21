const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    // Get all books
    const allBooks = await Book.find({});
    
    // Calculate statistics
    const totalBooks = allBooks.length;
    const verifiedBooks = allBooks.filter(book => book.status === 'verified').length;
    const pendingBooks = allBooks.filter(book => book.status === 'pending').length;
    
    // Get unique donors
    const uniqueDonors = new Set();
    allBooks.forEach(book => {
      if (book.donators && book.donators.length > 0) {
        book.donators.forEach(donor => {
          if (donor && donor.trim()) {
            uniqueDonors.add(donor.trim());
          }
        });
      }
    });
    
    // Get book types distribution
    const bookTypes = {};
    allBooks.forEach(book => {
      const genre = book.genre || 'अन्य';
      bookTypes[genre] = (bookTypes[genre] || 0) + 1;
    });
    
    res.json({
      totalBooks,
      verifiedBooks,
      pendingBooks,
      totalDonors: uniqueDonors.size,
      bookTypes
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/dashboard/recent-donors - Get recent donors
router.get('/recent-donors', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    // Get recent books with donors, sorted by creation date
    const recentBooks = await Book.find({
      donators: { $exists: true, $ne: [] }
    })
    .sort({ createdAt: -1 })
    .limit(limit * 2); // Get more to filter unique donors
    
    // Create unique donors list
    const uniqueDonorsMap = new Map();
    
    recentBooks.forEach(book => {
      if (book.donators && book.donators.length > 0) {
        const donorName = book.donators[0];
        if (donorName && !uniqueDonorsMap.has(donorName)) {
          uniqueDonorsMap.set(donorName, {
            name: donorName,
            bookTitle: book.title,
            bookAuthor: book.author,
            genre: book.genre,
            status: book.status,
            date: book.createdAt || new Date(),
            bookCount: 1
          });
        }
      }
    });
    
    // Convert to array and limit
    const recentDonors = Array.from(uniqueDonorsMap.values()).slice(0, limit);
    
    res.json(recentDonors);
  } catch (error) {
    console.error('Recent donors error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/dashboard/recent-donations - Get recent donations for table
router.get('/recent-donations', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    const recentDonations = await Book.find({
      donators: { $exists: true, $ne: [] }
    })
    .sort({ createdAt: -1 })
    .limit(limit);
    
    const formattedDonations = recentDonations.map(book => ({
      name: book.donators && book.donators.length > 0 ? book.donators[0] : 'अज्ञात',
      books: 1, // Each book record represents 1 book
      type: book.genre || 'अन्य',
      date: book.donationDate ? new Date(book.donationDate).toLocaleDateString('hi-IN') : 
            book.createdAt ? new Date(book.createdAt).toLocaleDateString('hi-IN') : 'अज्ञात',
      status: book.status || 'pending',
      title: book.title,
      author: book.author
    }));
    
    res.json(formattedDonations);
  } catch (error) {
    console.error('Recent donations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
