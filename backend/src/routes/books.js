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
    const { title, author, isbn, year, genre, description, donators, destinationOfBook } = req.body;
    const book = new Book({ title, author, isbn, year, genre, description, donators, destinationOfBook });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
