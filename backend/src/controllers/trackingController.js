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

// Get tracking history for a specific load
exports.getTrackingHistory = async (req, res) => {
    const { loadId } = req.params;
    try {
        const history = await allQuery(
            `SELECT * FROM tracking_updates WHERE load_id = ? ORDER BY created_at DESC`,
            [loadId]
        );
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch tracking history' });
    }
};

// Add a tracking update (Transporter only)
exports.addTrackingUpdate = async (req, res) => {
    const { loadId, status, location, note } = req.body;

    // In a real app, verify the user is the assigned transporter for this load

    try {
        await runQuery(
            `INSERT INTO tracking_updates (load_id, status, location, note) VALUES (?, ?, ?, ?)`,
            [loadId, status, location, note]
        );

        // Optionally update the main load status as well
        if (status === 'DELIVERED') {
            await runQuery(`UPDATE loads SET status = 'COMPLETED' WHERE id = ?`, [loadId]);
        } else if (status === 'PICKED_UP') {
            await runQuery(`UPDATE loads SET status = 'IN_TRANSIT' WHERE id = ?`, [loadId]);
        }

        res.json({ message: 'Tracking updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add tracking update' });
    }
};

// Get Active Jobs for Transporter (Loads where they have an ACCEPTED bid)
exports.getTransporterJobs = async (req, res) => {
    const userId = req.user.id;
    try {
        const jobs = await allQuery(`
            SELECT l.*, b.status as bid_status 
            FROM loads l
            JOIN bids b ON l.id = b.load_id
            WHERE b.transporter_id = ? AND b.status = 'ACCEPTED' AND l.status != 'COMPLETED'
        `, [userId]);
        res.json(jobs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch jobs' });
    }
};
