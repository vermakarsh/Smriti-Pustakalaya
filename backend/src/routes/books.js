const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// GET /api/books - fetch all books
router.get('/', async (req, res) => {
  try {
    const bookModel = new Book(req.app.locals.db);
    const books = await bookModel.findAll();
    res.json(books);
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Static debug route to confirm file and route registration
router.get('/debugtest', (req, res) => {
  res.json({ message: 'Debug route works!' });
});

// Debug: fetch book by ID
router.get('/debug/:id', async (req, res) => {
  try {
    const bookModel = new Book(req.app.locals.db);
    const book = await bookModel.findById(req.params.id);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error('Error fetching book by ID:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update book status for staff workflow
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const bookModel = new Book(req.app.locals.db);
    const book = await bookModel.update(req.params.id, { status });
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    console.error('Error updating book status:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update destinationOfBook for a book
router.put('/:id/destination', async (req, res) => {
  try {
    const { destinationOfBook } = req.body;
    console.log('Assigning destination for book id:', req.params.id);
    const bookModel = new Book(req.app.locals.db);
    const book = await bookModel.update(req.params.id, { destination_of_book: destinationOfBook });
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
    const bookModel = new Book(req.app.locals.db);
    const book = await bookModel.findByIsbn(req.params.isbn);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json({ donators: [book.donor_name] || [] });
  } catch (err) {
    console.error('Error fetching donators:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/books - add a new book
router.post('/', async (req, res) => {
  try {
    console.log('=== CREATING NEW BOOK ===');
    console.log('Request body:', req.body);
    
    const { title, author, isbn, genre, donor_name, donor_mobile, donor_address, donation_date, image_url, status } = req.body;
    
    // Validate required fields
    if (!title || !author) {
      console.log('Missing required fields: title or author');
      return res.status(400).json({ error: 'Title and author are required' });
    }
    
    const bookData = { 
      title, 
      author, 
      isbn, 
      genre,
      donor_name,
      donor_mobile,
      donor_address,
      donation_date: donation_date || new Date().toISOString().split('T')[0],
      image_url,
      status: status || 'Available'
    };
    
    console.log('Book data to save:', bookData);
    
    const bookModel = new Book(req.app.locals.db);
    const savedBook = await bookModel.create(bookData);
    
    console.log('Book saved successfully:', savedBook);
    console.log('=== BOOK CREATION COMPLETE ===');
    
    res.status(201).json(savedBook);
  } catch (err) {
    console.error('Error in POST /api/books:', err);
    console.error('Error details:', err.message);
    if (err.code === 'ER_DUP_ENTRY') {
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
    
    const bookModel = new Book(req.app.locals.db);
    
    // First check if book exists
    const existingBook = await bookModel.findById(req.params.id);
    if (!existingBook) {
      console.log('Book not found for verification id:', req.params.id);
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('Existing book before update:', existingBook);
    
    const book = await bookModel.update(req.params.id, {
      status: 'Available',
      destination_of_book: destinationOfBook || 'Default Location'
    });
    
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
    
    const bookModel = new Book(req.app.locals.db);
    
    // First check if book exists
    const existingBook = await bookModel.findById(req.params.id);
    if (!existingBook) {
      console.log('Book not found for deletion id:', req.params.id);
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('Book to delete:', existingBook);
    
    // Delete the book
    const deleted = await bookModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    console.log('Book deleted successfully');
    console.log('=== DELETE COMPLETE ===');
    
    res.json({ message: 'Book deleted successfully' });
  } catch (err) {
    console.error('Error in DELETE /api/books/:id:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
