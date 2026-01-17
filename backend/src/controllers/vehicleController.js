const db = require('../db');

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

exports.addVehicle = async (req, res) => {
    const { plate_number, type, capacity_kg, current_location } = req.body;
    const user = req.user;

    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can manage vehicles.' });
    }

    try {
        await runQuery(
            `INSERT INTO vehicles (company_id, plate_number, type, capacity_kg, current_location) VALUES (?, ?, ?, ?, ?)`,
            [user.company_id, plate_number, type, capacity_kg, current_location]
        );
        res.status(201).json({ message: 'Vehicle added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add vehicle' });
    }
};

exports.getMyVehicles = async (req, res) => {
    const user = req.user;
    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can view their fleet.' });
    }

    try {
        const vehicles = await allQuery(`SELECT * FROM vehicles WHERE company_id = ?`, [user.company_id]);
        res.json(vehicles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch vehicles' });
    }
};

exports.updateVehicleStatus = async (req, res) => {
    const { id } = req.params;
    const { status, current_location } = req.body;
    const user = req.user;

    try {
        // Verify ownership of vehicle
        const vehicle = await getQuery(`SELECT company_id FROM vehicles WHERE id = ?`, [id]);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if (vehicle.company_id !== user.company_id) {
            return res.status(403).json({ error: 'You are not authorized to update this vehicle' });
        }

        await runQuery(
            `UPDATE vehicles SET status = COALESCE(?, status), current_location = COALESCE(?, current_location) WHERE id = ?`,
            [status, current_location, id]
        );
        res.json({ message: 'Vehicle updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update vehicle' });
    }
};

exports.deleteVehicle = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can manage vehicles.' });
    }

    try {
        // Verify ownership of vehicle
        const vehicle = await getQuery(`SELECT company_id FROM vehicles WHERE id = ?`, [id]);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }

        if (vehicle.company_id !== user.company_id) {
            return res.status(403).json({ error: 'You are not authorized to delete this vehicle' });
        }

        await runQuery(`DELETE FROM vehicles WHERE id = ?`, [id]);
        res.json({ message: 'Vehicle deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete vehicle' });
    }
};
