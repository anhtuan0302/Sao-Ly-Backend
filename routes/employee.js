var express = require('express');
var router = express.Router();
const EmployeeModel = require('../models/employee/employee');
const { authenticateToken, checkRole } = require('../middleware/auth');

// Get all employees (accessible by different roles with different data)
router.get('/', authenticateToken, async (req, res) => {
  try {
      let employees;
      if (req.user.role === 'admin' || req.user.role === 'director') {
          employees = await EmployeeModel.find();
      } else if (req.user.role !== 'customer' || req.user.role !== 'student') {
          employees = await EmployeeModel.find().select('-startDate -endDate -accountNumber -bankName -wage -allowance -salaries -timekeeping');
      } else {
          return res.status(403).json({ message: 'Access denied' });
      }
      res.json(employees);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Get a single employee by ID (accessible by different roles with different data)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
      const employee = await EmployeeModel.findById(req.params.id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }
      if (req.user.role === 'admin' || req.user.role === 'director') {
          res.json(employee);
      } else if (req.user.role !== 'customer' || req.user.role !== 'student') {
          res.json(employee.select('-startDate -endDate -accountNumber -bankName -wage -allowance -salaries -timekeeping'));
      } else {
          return res.status(403).json({ message: 'Access denied' });
      }
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

// Add a new employee (only accessible by admins, directors, and managers)
router.post('/add', authenticateToken, checkRole(['admin', 'director']), async (req, res) => {
  const employee = new EmployeeModel(req.body);
  try {
      await employee.save();
      res.status(201).json({ message: 'Employee created successfully', employee: employee.id });
  } catch (err) {
      res.status(400).json({ message: err.message });
  }
});

// Update an employee by ID (accessible by different roles with different data)
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
      const employee = await EmployeeModel.findById(id);
      if (!employee) {
          return res.status(404).json({ message: 'Employee not found' });
      }

      await employee.save();
      res.json({ message: 'Employee updated successfully', employee: employee.id });
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});

  module.exports = router;