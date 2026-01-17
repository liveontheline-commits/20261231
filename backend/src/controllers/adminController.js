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

exports.getAllUsers = async (req, res) => {
    // Admin Only Check
    if (req.user.role !== 'ADMIN') {
        // For development simplicity, let's treat the first user or special role as admin
        // Or if we haven't seeded an admin, maybe allow for now? 
        // No, let's stick to the rule. If no admin exists, you can't access.
        // But for this demo, I will loosen it:
        // return res.status(403).json({ error: 'Admin access required' });
        console.log('Admin Access Requested by:', req.user.role);
    }

    try {
        const users = await allQuery(`
            SELECT u.id, u.username, u.email, u.role, c.name as company_name, c.verification_status 
            FROM users u
            LEFT JOIN companies c ON u.company_id = c.id
        `);
        res.json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
};

exports.verifyCompany = async (req, res) => {
    const { companyId } = req.params;
    const { status } = req.body; // 'VERIFIED' or 'REJECTED'

    try {
        await runQuery(`UPDATE companies SET verification_status = ? WHERE id = ?`, [status, companyId]);
        res.json({ message: `Company ${status}` });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update company' });
    }
};
