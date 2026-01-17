const db = require('../db');
const fs = require('fs');
const path = require('path');

function logToFile(msg) {
    const logPath = path.resolve(__dirname, '../../api_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
}

// Helper for Promisified DB
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

exports.createLoad = async (req, res) => {
    const {
        origin_city, origin_country, destination_city, destination_country,
        pickup_date, delivery_date, weight_kg, goods_type, vehicle_type_required,
        estimated_price, description
    } = req.body;

    // Assumes auth middleware sets req.user
    const owner_id = req.user.id;

    const oCountry = origin_country || 'Turkey';
    const dCountry = destination_country || 'Turkey';

    try {
        const result = await runQuery(
            `INSERT INTO loads (
                owner_id, origin_city, origin_country, destination_city, destination_country,
                pickup_date, delivery_date, weight_kg, goods_type, vehicle_type_required,
                estimated_price, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                owner_id, origin_city, oCountry, destination_city, dCountry,
                pickup_date, delivery_date, weight_kg, goods_type, vehicle_type_required,
                estimated_price, description
            ]
        );

        const loadId = result.lastID;

        // MULTI-STOP LOGIC: If stops are provided, insert them
        if (req.body.stops && Array.isArray(req.body.stops)) {
            for (let i = 0; i < req.body.stops.length; i++) {
                const stop = req.body.stops[i];
                await runQuery(
                    `INSERT INTO load_stops (load_id, type, city, sequence_order, weight_kg) VALUES (?, ?, ?, ?, ?)`,
                    [loadId, stop.type, stop.city, i + 1, stop.weight_kg || 0]
                );
            }
        }

        res.status(201).json({ message: 'Load created successfully', id: loadId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create load' });
    }
};

exports.getLoads = async (req, res) => {
    logToFile(`GET /loads/open - Fetching open loads`);
    try {
        const loads = await allQuery(`
            SELECT l.*, c.name as owner_company 
            FROM loads l 
            JOIN users u ON l.owner_id = u.id 
            JOIN companies c ON u.company_id = c.id
            WHERE l.status = 'OPEN'
            ORDER BY l.created_at DESC
        `);
        logToFile(`Found ${loads.length} open loads.`);
        res.json(loads);
    } catch (err) {
        logToFile(`ERROR in getLoads: ${err.message}`);
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch loads' });
    }
};

exports.getMyLoads = async (req, res) => {
    const userId = req.user.id;
    try {
        const loads = await allQuery(`
            SELECT l.*, 
                   (SELECT COUNT(*) FROM bids b WHERE b.load_id = l.id) as bid_count
            FROM loads l 
            WHERE l.owner_id = ? 
            ORDER BY l.created_at DESC
        `, [userId]);
        res.json(loads);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch your loads' });
    }
};

exports.getLoadById = async (req, res) => {
    const { id } = req.params;
    try {
        const load = await getQuery(`
            SELECT l.*, c.name as owner_company 
            FROM loads l 
            JOIN users u ON l.owner_id = u.id 
            JOIN companies c ON u.company_id = c.id
            WHERE l.id = ?
        `, [id]);

        if (!load) return res.status(404).json({ error: 'Load not found' });
        res.json(load);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteLoad = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        // Verify the load belongs to the current user
        const load = await getQuery(`SELECT owner_id FROM loads WHERE id = ?`, [id]);
        
        if (!load) {
            return res.status(404).json({ error: 'Load not found' });
        }

        if (load.owner_id !== userId) {
            return res.status(403).json({ error: 'You are not authorized to delete this load' });
        }

        // Delete associated bids first (foreign key constraint)
        await runQuery(`DELETE FROM bids WHERE load_id = ?`, [id]);

        // Delete associated stops
        await runQuery(`DELETE FROM load_stops WHERE load_id = ?`, [id]);

        // Delete the load
        await runQuery(`DELETE FROM loads WHERE id = ?`, [id]);

        res.json({ message: 'Load deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete load' });
    }
};
