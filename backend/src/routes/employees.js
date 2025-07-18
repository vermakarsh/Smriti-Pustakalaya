const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new employee
router.post('/', async (req, res) => {
  try {
    const { userId, password } = req.body;
    if (!userId || !password) {
      return res.status(400).json({ error: 'userId and password required' });
    }
    const employee = new Employee({ userId, password });
    await employee.save();
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const result = await Employee.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Employee login endpoint
router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  if (!userId || !password) {
    return res.status(400).json({ error: 'userId and password required' });
  }
  try {
    const employee = await Employee.findOne({ userId, password });
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', employeeId: employee._id, userId: employee.userId });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
