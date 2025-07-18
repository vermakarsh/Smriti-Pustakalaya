const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // You can add more fields as needed
});

module.exports = mongoose.model('Employee', employeeSchema);
