const db = require('../config/db');

exports.getAnalytics = (req, res) => {
    db.get('SELECT COUNT(*) as totalScans FROM documents', [], (err, stats) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch analytics' });
        db.get('SELECT u.username FROM documents d JOIN users u ON d.userId = u.id GROUP BY u.id, u.username ORDER BY COUNT(*) DESC LIMIT 1', [], (err, top) => {
            if (err) return res.status(500).json({ message: 'Failed to fetch top user' });
            res.json({ totalScans: stats.totalScans, topUser: top ? top.username : 'N/A' });
        });
    });
};