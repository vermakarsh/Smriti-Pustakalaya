const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Unknown' },
  role: { type: String, default: 'employee' },
  email: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', employeeSchema);
