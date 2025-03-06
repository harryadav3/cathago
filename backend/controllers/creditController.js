const db = require('../config/db');

exports.requestCredits = (req, res) => {
    const userId = req.user.id;
    db.run('INSERT INTO credit_requests (userId) VALUES (?)', [userId], function(err) {
        if (err) return res.status(500).json({ message: 'Request failed' });
        res.json({ message: 'Credit request sent' });
    });
};

exports.approveCredits = (req, res) => {
    const requestId = req.params.requestId;
    db.get('SELECT userId FROM credit_requests WHERE id = ? AND status = "pending"', [requestId], (err, request) => {
        if (err || !request) return res.status(404).json({ message: 'Request not found' });
        db.run('UPDATE users SET credits = credits + 10 WHERE id = ?', [request.userId], (err) => {
            if (err) return res.status(500).json({ message: 'Failed to update credits' });
            db.run('UPDATE credit_requests SET status = "approved" WHERE id = ?', [requestId], (err) => {
                if (err) return res.status(500).json({ message: 'Failed to approve request' });
                res.json({ message: 'Credits approved' });
            });
        });
    });
};

exports.getRequests = (req, res) => {
    db.all('SELECT cr.id, u.username FROM credit_requests cr JOIN users u ON cr.userId = u.id WHERE cr.status = "pending"', [], (err, rows) => {
        if (err) return res.status(500).json({ message: 'Failed to fetch requests' });
        res.json(rows);
    });
};