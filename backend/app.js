const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const creditRoutes = require('./routes/creditRoutes');
const scanRoutes = require('./routes/scanRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'], 
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use(express.json());
app.use(fileUpload());
app.use('/auth', authRoutes);
app.use('/credits', creditRoutes);
app.use('/scan', scanRoutes);
app.use('/admin', adminRoutes);

app.get('/user/profile', require('./middleware/auth'), (req, res) => {
    const db = require('./config/db');
    db.get('SELECT username, credits FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err || !user) return res.status(500).json({ message: 'User not found' });
        db.all('SELECT id, filename FROM documents WHERE userId = ?', [req.user.id], (err, scans) => {
            if (err) return res.status(500).json({ message: 'Failed to fetch scans' });
            res.json({ username: user.username, credits: user.credits, scans });
        });
    });
});

module.exports = app;