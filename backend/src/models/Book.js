const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  year: { type: Number },
  genre: { type: String },
  description: { type: String },
  donators: [{ type: String }], // Array of donor names or IDs
  destinationOfBook: { type: String, default: '' }, // Location assignment
  status: { type: String, default: 'pending' }, // Book status for staff workflow
  image: { type: String }, // Image URL or file path
});

module.exports = mongoose.model('Book', BookSchema);
