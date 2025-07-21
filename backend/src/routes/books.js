const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books - fetch all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Static debug route to confirm file and route registration
router.get('/debugtest', (req, res) => {
  res.json({ message: 'Debug route works!' });
});



// Debug: fetch book by MongoDB _id
router.get('/debug/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update book status for staff workflow
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update destinationOfBook for a book
router.put('/:id/destination', async (req, res) => {
  try {
    const { destinationOfBook } = req.body;
    console.log('Assigning destination for book id:', req.params.id);
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { destinationOfBook },
      { new: true }
    );
    if (!book) {
      console.log('Book not found for id:', req.params.id);
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (err) {
    console.error('Error in PUT /api/books/:id/destination:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/books/:isbn/donators - fetch donators by ISBN
router.get('/:isbn/donators', async (req, res) => {
  try {
    const book = await Book.findOne({ isbn: req.params.isbn });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book.donators || []);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/books - add a new book
router.post('/', async (req, res) => {
  try {
    console.log('=== CREATING NEW BOOK ===');
    console.log('Request body:', req.body);
    
    const { title, author, isbn, year, genre, description, donators, destinationOfBook, status, donationDate } = req.body;
    
    // Validate required fields
    if (!title || !author) {
      console.log('Missing required fields: title or author');
      return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const bookData = { 
      title, 
      author, 
      isbn, 
      year, 
      genre, 
      description, 
      donators, 
      destinationOfBook,
      status: status || 'pending',
      donationDate: donationDate ? new Date(donationDate) : new Date()
    };
    
    console.log('Book data to save:', bookData);
    
    const book = new Book(bookData);
    const savedBook = await book.save();
    
    console.log('Book saved successfully:', savedBook);
    console.log('=== BOOK CREATION COMPLETE ===');
    
    res.status(201).json(savedBook);
  } catch (err) {
    console.error('Error in POST /api/books:', err);
    console.error('Error details:', err.message);
    if (err.code === 11000) {
      res.status(400).json({ error: 'ISBN already exists' });
    } else {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
});

// POST /api/books/:id/verify - verify a book donation
router.post('/:id/verify', async (req, res) => {
  try {
    const { destinationOfBook } = req.body;
    console.log('=== VERIFICATION REQUEST ===');
    console.log('Book ID:', req.params.id);
    console.log('Destination:', destinationOfBook);
    console.log('Request body:', req.body);
    
    // First check if book exists
    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) {
      console.log('Book not found for verification id:', req.params.id);
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('Existing book before update:', existingBook);
    
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      { 
        status: 'verified',
        destinationOfBook: destinationOfBook || 'Default Location'
      },
      { new: true }
    );
    
    console.log('Book after verification update:', book);
    console.log('=== VERIFICATION COMPLETE ===');
    
    res.json({ message: 'Book verified successfully', book });
  } catch (err) {
    console.error('Error in POST /api/books/:id/verify:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// DELETE /api/books/:id - delete a book
router.delete('/:id', async (req, res) => {
  try {
    console.log('=== DELETE BOOK REQUEST ===');
    console.log('Book ID:', req.params.id);
    
    // First check if book exists
    const existingBook = await Book.findById(req.params.id);
    if (!existingBook) {
      console.log('Book not found for deletion id:', req.params.id);
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('Book to delete:', existingBook);
    
    // Delete the book
    await Book.findByIdAndDelete(req.params.id);
    
    console.log('Book deleted successfully');
    console.log('=== DELETE COMPLETE ===');
    
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/books/:id:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
