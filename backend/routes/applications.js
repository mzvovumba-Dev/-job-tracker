const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../database');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'secret123');
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all applications
router.get('/', verifyToken, (req, res) => {
  try {
    const applications = db.prepare('SELECT * FROM applications WHERE user_id = ?').all(req.userId);
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Add new application
router.post('/', verifyToken, (req, res) => {
  const { company, position, status, notes } = req.body;

  if (!company || !position) {
    return res.status(400).json({ message: 'Company and position are required' });
  }

  try {
    const stmt = db.prepare('INSERT INTO applications (user_id, company, position, status, notes) VALUES (?, ?, ?, ?, ?)');
    const result = stmt.run(req.userId, company, position, status || 'Applied', notes || '');
    
    res.status(201).json({ message: 'Application added!', id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Update application
router.put('/:id', verifyToken, (req, res) => {
  const { company, position, status, notes } = req.body;

  try {
    const stmt = db.prepare('UPDATE applications SET company = ?, position = ?, status = ?, notes = ? WHERE id = ? AND user_id = ?');
    stmt.run(company, position, status, notes, req.params.id, req.userId);
    
    res.json({ message: 'Application updated!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Delete application
router.delete('/:id', verifyToken, (req, res) => {
  try {
    const stmt = db.prepare('DELETE FROM applications WHERE id = ? AND user_id = ?');
    stmt.run(req.params.id, req.userId);
    
    res.json({ message: 'Application deleted!' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

module.exports = router;