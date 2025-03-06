const db = require('../config/db');
const fs = require('fs');
const path = require('path');

exports.scan = (req, res) => {
    const userId = req.user.id;
    if (req.user.credits < 1) return res.status(403).json({ message: 'Insufficient credits' });

    const file = req.files.file;
    const filename = `${Date.now()}-${file.name}`;
    const filepath = path.join(__dirname, '../uploads', filename);

    file.mv(filepath, (err) => {
        if (err) return res.status(500).json({ message: 'File upload failed' });
        const content = fs.readFileSync(filepath, 'utf8');
        db.run('INSERT INTO documents (userId, filename, content) VALUES (?, ?, ?)', [userId, filename, content], function(err) {
            if (err) return res.status(500).json({ message: 'Scan failed' });
            db.run('UPDATE users SET credits = credits - 1 WHERE id = ?', [userId], (err) => {
                if (err) return res.status(500).json({ message: 'Credit deduction failed' });
                res.json({ docId: this.lastID });
            });
        });
    });
};

exports.getMatches = (req, res) => {
    const docId = req.params.docId;
    db.get('SELECT content FROM documents WHERE id = ?', [docId], (err, doc) => {
        if (err || !doc) return res.status(404).json({ message: 'Document not found' });
        db.all('SELECT id, filename, content FROM documents WHERE id != ?', [docId], (err, docs) => {
            if (err) return res.status(500).json({ message: 'Failed to fetch documents' });
            const matches = docs.map(d => ({
                id: d.id,
                filename: d.filename,
                similarity: calculateSimilarity(doc.content, d.content)
            })).filter(m => m.similarity > 50);
            res.json(matches);
        });
    });
};

function calculateSimilarity(str1, str2) {
    const levDistance = levenshteinDistance(str1, str2);
    const maxLen = Math.max(str1.length, str2.length);
    return Math.round((1 - levDistance / maxLen) * 100);
}

function levenshteinDistance(str1, str2) {
    const dp = Array(str1.length + 1).fill(null).map(() => Array(str2.length + 1).fill(null));
    for (let i = 0; i <= str1.length; i++) dp[i][0] = i;
    for (let j = 0; j <= str2.length; j++) dp[0][j] = j;
    for (let i = 1; i <= str1.length; i++) {
        for (let j = 1; j <= str2.length; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[str1.length][str2.length];
}