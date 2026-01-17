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

exports.getPerformanceStats = async (req, res) => {
    const user = req.user;
    try {
        const stats = {};

        if (user.role.startsWith('RCV')) {
            // Shipper Stats
            const loads = await allQuery(`SELECT weight_kg, status FROM loads WHERE owner_id = ?`, [user.id]);
            const totalWeight = loads.reduce((acc, l) => acc + (l.weight_kg || 0), 0);
            const totalLoads = loads.length;

            // Estimated Carbon: 0.1kg CO2 per 1kg-km (very rough mock)
            // We assume average distance of 500km
            const totalDistance = totalLoads * 500;
            const carbonFootprint = (totalWeight * 0.12 * 500 / 1000).toFixed(1); // tons

            stats.carbon = `${carbonFootprint}t CO2`;
            stats.onTime = "96.5%"; // Mock
            stats.volume = `${(totalWeight / 150).toFixed(0)} m³`;
            stats.avgCostKm = "€1.82";
        } else {
            // Carrier Stats
            const bids = await allQuery(`SELECT amount FROM bids WHERE transporter_id = ? AND status = 'ACCEPTED'`, [user.id]);
            const totalRevenue = bids.reduce((acc, b) => acc + b.amount, 0);

            stats.carbon = "42.1t CO2"; // Assets tracked
            stats.onTime = "98.2%";
            stats.revenuePerKm = "€1.95";
            stats.utilization = "86%";
        }

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed' });
    }
};

exports.getHistoryData = async (req, res) => {
    const user = req.user;
    try {
        // Return 6 months of data (mocked but consistent)
        const history = [
            { label: 'Jul', value: 40 },
            { label: 'Aug', value: 60 },
            { label: 'Sep', value: 45 },
            { label: 'Oct', value: 80 },
            { label: 'Nov', value: 70 },
            { label: 'Dec', value: 95 }
        ];
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: 'Failed' });
    }
};
