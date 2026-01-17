const db = require('../db');

function allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

exports.getNotifications = async (req, res) => {
    const userId = req.user.id;
    try {
        const notifications = await allQuery(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20`,
            [userId]
        );
        res.json(notifications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
};

exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await runQuery(
            `UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?`,
            [id, userId]
        );
        res.json({ message: 'Marked as read' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update notification' });
    }
};

// Internal helper for other controllers
exports.createNotification = async (userId, type, message) => {
    try {
        await runQuery(
            `INSERT INTO notifications (user_id, type, message) VALUES (?, ?, ?)`,
            [userId, type, message]
        );
    } catch (err) {
        console.error('Failed to create notification:', err);
    }
};
