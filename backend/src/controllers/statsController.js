const db = require('../db');

function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
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

exports.getDashboardStats = async (req, res) => {
    const user = req.user;
    const stats = {};

    try {
        if (user.role.startsWith('TRANS')) {
            // Transporter Stats

            // 1. Total Bids
            const bidsCount = await getQuery(
                `SELECT COUNT(*) as count FROM bids WHERE transporter_id = ?`,
                [user.id]
            );
            stats.total_bids = bidsCount.count;

            // 2. Active (Pending) Bids
            const pendingBids = await getQuery(
                `SELECT COUNT(*) as count FROM bids WHERE transporter_id = ? AND status = 'PENDING'`,
                [user.id]
            );
            stats.pending_bids = pendingBids.count;

            // 3. Won Bids / Jobs
            const wonBids = await getQuery(
                `SELECT COUNT(*) as count, SUM(amount) as revenue FROM bids WHERE transporter_id = ? AND status = 'ACCEPTED'`,
                [user.id]
            );
            stats.won_jobs = wonBids.count;
            stats.total_revenue = wonBids.revenue || 0;

            // 4. Fleet Status
            const fleet = await allQuery(
                `SELECT status, COUNT(*) as count FROM vehicles WHERE company_id = ? GROUP BY status`,
                [user.company_id]
            );
            stats.fleet_status = fleet;

        } else if (user.role.startsWith('RCV')) {
            // Receiver Stats

            // 1. Total Loads Posted
            const loadsCount = await getQuery(
                `SELECT COUNT(*) as count FROM loads WHERE owner_id = ?`,
                [user.id]
            );
            stats.total_loads = loadsCount.count;

            // 2. Active Loads (Open)
            const activeLoads = await getQuery(
                `SELECT COUNT(*) as count FROM loads WHERE owner_id = ? AND status = 'OPEN'`,
                [user.id]
            );
            stats.active_loads = activeLoads.count;

            // 3. Total Spent (Estimated from Accepted Bids on my loads)
            // Join loads and bids where load owner is me and bid is accepted
            const spent = await getQuery(
                `SELECT SUM(b.amount) as total 
                 FROM bids b
                 JOIN loads l ON b.load_id = l.id
                 WHERE l.owner_id = ? AND b.status = 'ACCEPTED'`,
                [user.id]
            );
            stats.total_spent = spent.total || 0;

            // 4. Load Status Distribution
            const loadDist = await allQuery(
                `SELECT status, COUNT(*) as count FROM loads WHERE owner_id = ? GROUP BY status`,
                [user.id]
            );
            stats.load_distribution = loadDist;

            // 5. Recent Loads (for immediate feedback)
            const recentLoads = await allQuery(
                `SELECT id, origin_city, destination_city, status, created_at 
                 FROM loads WHERE owner_id = ? 
                 ORDER BY created_at DESC LIMIT 3`,
                [user.id]
            );
            stats.recent_loads = recentLoads;
        }

        res.json(stats);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
