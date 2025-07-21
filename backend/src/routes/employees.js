const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employeeModel = new Employee(req.app.locals.db);
    const employees = await employeeModel.findAll();
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new employee
router.post('/', async (req, res) => {
  try {
    console.log('Creating employee with data:', req.body);
    const { userId, employeeId, employee_id, password, name, email, phone, department, designation } = req.body;
    
    // Support multiple field names for employee ID
    const id = userId || employeeId || employee_id;
    
    if (!id || !password) {
      return res.status(400).json({ error: 'Employee ID and password required' });
    }
    
    const employeeData = {
      employee_id: id,
      password,
      name: name || 'Unknown',
      email: email || `${id}@library.com`,
      phone: phone || '',
      department: department || 'General',
      designation: designation || 'Employee'
    };
    
    console.log('Employee data to save:', employeeData);
    
    const employeeModel = new Employee(req.app.locals.db);
    const savedEmployee = await employeeModel.create(employeeData);
    
    console.log('Employee created successfully:', savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (err) {
    console.error('Error creating employee:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ error: 'Employee ID already exists' });
    } else {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employeeModel = new Employee(req.app.locals.db);
    const deleted = await employeeModel.delete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted' });
  } catch (err) {
    console.error('Error deleting employee:', err);
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
    const employeeModel = new Employee(req.app.locals.db);
    const employee = await employeeModel.validateLogin(userId, password);
    if (!employee) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ 
      message: 'Login successful', 
      employeeId: employee.id, 
      userId: employee.employee_id,
      name: employee.name,
      email: employee.email
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
