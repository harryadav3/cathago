const db = require('../config/db');

function resetCredits() {
    db.run('UPDATE users SET credits = 20', [], (err) => {
        if (err) console.error('Failed to reset credits:', err);
        else console.log('Credits reset for all users');
    });
}

// Reset credits every midnight
setInterval(() => {
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) resetCredits();
}, 60 * 1000);

module.exports = resetCredits;