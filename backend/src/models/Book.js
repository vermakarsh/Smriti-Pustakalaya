const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String }, // Removed unique constraint to avoid conflicts
  year: { type: Number },
  genre: { type: String },
  description: { type: String },
  donators: [{ type: String }], // Array of donor names or IDs
  destinationOfBook: { type: String, default: '' }, // Location assignment
  status: { type: String, default: 'pending' }, // Book status for staff workflow
  image: { type: String }, // Image URL or file path
  donationDate: { type: Date, default: Date.now }, // Date when the book was donated
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

module.exports = mongoose.model('Book', BookSchema);
