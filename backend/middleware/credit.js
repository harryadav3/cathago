const db = require('../config/db');

module.exports = (req, res, next) => {
    db.get('SELECT credits FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ message: 'User not found' });
        req.user.credits = user.credits;
        next();
    });
};