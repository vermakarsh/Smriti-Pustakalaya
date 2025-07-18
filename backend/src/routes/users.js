const express = require('express');
const router = express.Router();

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// JWT authentication middleware
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }
    jwt.verify(token, process.env.JWT_SECRET || 'secret', (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token.' });
        req.user = user;
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only.' });
        }
        next();
    });
}

// List users (protected)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
