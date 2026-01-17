const db = require('../db');
const fs = require('fs');
const path = require('path');
const notificationController = require('./notificationController');

function logToFile(msg) {
    const logPath = path.resolve(__dirname, '../../api_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
}

function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

function allQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.all(query, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

exports.placeBid = async (req, res) => {
    // Handle both naming conventions to be safe
    const load_id = req.body.load_id || req.body.loadId;
    const { amount, message } = req.body;
    const transporter_id = req.user.id;

    logToFile(`POST /bids - User: ${transporter_id}, Load: ${load_id}, Amount: ${amount}`);

    if (req.user.role.startsWith('RCV')) {
        logToFile('Fail: Shipper cannot bid');
        return res.status(403).json({ error: 'Only transporters can bid.' });
    }

    if (!load_id || !amount) {
        logToFile('Fail: Missing load_id or amount');
        return res.status(400).json({ error: 'Missing load_id or amount' });
    }

    try {
        await runQuery(
            `INSERT INTO bids (load_id, transporter_id, amount, message) VALUES (?, ?, ?, ?)`,
            [load_id, transporter_id, amount, message]
        );
        logToFile('Success: Bid saved to DB');

        // Notify Load Owner
        const load = await getQuery(`SELECT owner_id, origin_city, destination_city FROM loads WHERE id = ?`, [load_id]);
        if (load) {
            logToFile(`Notifying load owner: ${load.owner_id}`);
            await notificationController.createNotification(
                load.owner_id,
                'NEW_BID',
                `New bid of €${amount} received for shipment ${load.origin_city} -> ${load.destination_city}`
            );
        }

        res.status(201).json({ message: 'Bid placed successfully' });
    } catch (err) {
        logToFile(`DB ERROR in placeBid: ${err.message}`);
        console.error(err);
        res.status(500).json({ error: 'Database failure: ' + err.message });
    }
};

exports.getBidsForLoad = async (req, res) => {
    const { loadId } = req.params;

    // Security check: ensure the requestor is the owner of the load OR the bidder?
    // For simplicity: Load Owner sees all. Transporter sees their own? 
    // Let's allow Load Owner (Receiver) to see all bids for now.

    try {
        const load = await getQuery(`SELECT owner_id FROM loads WHERE id = ?`, [loadId]);
        if (!load) return res.status(404).json({ error: 'Load not found' });

        if (load.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to view bids for this load' });
        }

        const bids = await allQuery(`
            SELECT b.*, c.name as transporter_company 
            FROM bids b
            JOIN users u ON b.transporter_id = u.id
            JOIN companies c ON u.company_id = c.id
            WHERE b.load_id = ?
            ORDER BY b.amount ASC
        `, [loadId]);

        res.json(bids);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.respondToBid = async (req, res) => {
    const { bidId } = req.params;
    const { status } = req.body; // 'ACCEPTED' or 'REJECTED'

    if (!['ACCEPTED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Verify user owns the load associated with this bid
        const bid = await getQuery(`SELECT * FROM bids WHERE id = ?`, [bidId]);
        if (!bid) return res.status(404).json({ error: 'Bid not found' });

        const load = await getQuery(`SELECT owner_id FROM loads WHERE id = ?`, [bid.load_id]);
        if (load.owner_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        // Update bid status
        await runQuery(`UPDATE bids SET status = ? WHERE id = ?`, [status, bidId]);

        // If Accepted, update Load status to ASSIGNED?
        if (status === 'ACCEPTED') {
            await runQuery(`UPDATE loads SET status = 'ASSIGNED' WHERE id = ?`, [bid.load_id]);
            // Reject other bids? Optional but good practice
        }

        // Notify Transporter
        const loadInfo = await getQuery(`SELECT origin_city, destination_city FROM loads WHERE id = ?`, [bid.load_id]);
        await notificationController.createNotification(
            bid.transporter_id,
            'BID_RESPONDED',
            `Your bid for ${loadInfo.origin_city} -> ${loadInfo.destination_city} has been ${status.toLowerCase()}`
        );

        res.json({ message: `Bid ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};
