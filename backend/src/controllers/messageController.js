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
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

exports.getMessages = async (req, res) => {
    const { loadId } = req.params;
    try {
        const messages = await allQuery(
            `SELECT m.*, u.username as sender_name 
             FROM messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE m.load_id = ? 
             ORDER BY m.created_at ASC`,
            [loadId]
        );
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

exports.sendMessage = async (req, res) => {
    const { loadId, receiverId, content } = req.body;
    const senderId = req.user.id;

    try {
        await runQuery(
            `INSERT INTO messages (load_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)`,
            [loadId, senderId, receiverId, content]
        );
        res.json({ message: 'Message sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
