const db = require('../db');

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

exports.getTransactions = async (req, res) => {
    const user = req.user;
    try {
        let query = '';
        let params = [user.id];

        if (user.role.startsWith('RCV')) {
            // Shipper sees payments made
            query = `
                SELECT b.*, l.origin_city, l.destination_city, l.pickup_date, c.name as transporter_company
                FROM bids b
                JOIN loads l ON b.load_id = l.id
                JOIN users u ON b.transporter_id = u.id
                JOIN companies c ON u.company_id = c.id
                WHERE l.owner_id = ? AND b.status = 'ACCEPTED'
                ORDER BY b.created_at DESC
            `;
        } else {
            // Carrier sees revenue earned
            query = `
                SELECT b.*, l.origin_city, l.destination_city, l.pickup_date, c.name as shipper_company
                FROM bids b
                JOIN loads l ON b.load_id = l.id
                JOIN users u ON l.owner_id = u.id
                JOIN companies c ON u.company_id = c.id
                WHERE b.transporter_id = ? AND b.status = 'ACCEPTED'
                ORDER BY b.created_at DESC
            `;
        }

        const transactions = await allQuery(query, params);
        res.json(transactions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
};

exports.getFinancialSummary = async (req, res) => {
    const user = req.user;
    try {
        let stats = {};
        if (user.role.startsWith('RCV')) {
            const result = await getQuery(
                `SELECT SUM(b.amount) as total_spent, COUNT(*) as count 
                 FROM bids b JOIN loads l ON b.load_id = l.id 
                 WHERE l.owner_id = ? AND b.status = 'ACCEPTED'`,
                [user.id]
            );
            stats = {
                balance_label: 'Total Freight Spend',
                amount: result.total_spent || 0,
                transaction_count: result.count || 0,
                pending_payments: 0 // Placeholder
            };
        } else {
            const result = await getQuery(
                `SELECT SUM(amount) as total_revenue, COUNT(*) as count 
                 FROM bids WHERE transporter_id = ? AND status = 'ACCEPTED'`,
                [user.id]
            );
            stats = {
                balance_label: 'Total Gross Revenue',
                amount: result.total_revenue || 0,
                transaction_count: result.count || 0,
                pending_settlements: 0 // Placeholder
            };
        }
        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch summary' });
    }
};
