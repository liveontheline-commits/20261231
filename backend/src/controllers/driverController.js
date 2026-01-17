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

exports.addDriver = async (req, res) => {
    const { full_name, license_number, phone, id_expiry_date, license_expiry_date, src_expiry_date, psychotechnic_expiry_date } = req.body;
    const user = req.user;

    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can manage drivers.' });
    }

    try {
        await runQuery(
            `INSERT INTO drivers (company_id, full_name, license_number, phone, id_expiry_date, license_expiry_date, src_expiry_date, psychotechnic_expiry_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [user.company_id, full_name, license_number, phone, id_expiry_date, license_expiry_date, src_expiry_date, psychotechnic_expiry_date]
        );
        res.status(201).json({ message: 'Driver added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to add driver' });
    }
};

exports.getMyDrivers = async (req, res) => {
    const user = req.user;
    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can view their drivers.' });
    }

    try {
        const drivers = await allQuery(`SELECT * FROM drivers WHERE company_id = ?`, [user.company_id]);
        res.json(drivers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch drivers' });
    }
};

exports.updateDriver = async (req, res) => {
    const { id } = req.params;
    const { full_name, phone, license_number, status } = req.body;
    const user = req.user;

    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can manage drivers.' });
    }

    try {
        // Verify ownership of driver
        const driver = await getQuery(`SELECT company_id FROM drivers WHERE id = ?`, [id]);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        if (driver.company_id !== user.company_id) {
            return res.status(403).json({ error: 'You are not authorized to update this driver' });
        }

        await runQuery(
            `UPDATE drivers SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), license_number = COALESCE(?, license_number), status = COALESCE(?, status) WHERE id = ?`,
            [full_name, phone, license_number, status, id]
        );
        res.json({ message: 'Driver updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update driver' });
    }
};

exports.deleteDriver = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    if (!user.role.startsWith('TRANS')) {
        return res.status(403).json({ error: 'Only transporters can manage drivers.' });
    }

    try {
        // Verify ownership of driver
        const driver = await getQuery(`SELECT company_id FROM drivers WHERE id = ?`, [id]);
        if (!driver) {
            return res.status(404).json({ error: 'Driver not found' });
        }

        if (driver.company_id !== user.company_id) {
            return res.status(403).json({ error: 'You are not authorized to delete this driver' });
        }

        await runQuery(`DELETE FROM drivers WHERE id = ?`, [id]);
        res.json({ message: 'Driver deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete driver' });
    }
};
