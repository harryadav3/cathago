const jwt = require('jsonwebtoken');
const secret = 'your-secret-key';

module.exports = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = decoded;
        next();
    });
};

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin access required' });
    next();
};