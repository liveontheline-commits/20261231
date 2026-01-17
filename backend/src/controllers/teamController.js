const db = require('../db');
const bcrypt = require('bcrypt');

exports.getTeamMembers = (req, res) => {
    const companyId = req.user.company_id;
    db.all(`SELECT id, username, email, role, full_name, status FROM users WHERE company_id = ?`, [companyId], (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json(rows);
    });
};

exports.addTeamMember = async (req, res) => {
    const { username, email, password, full_name, role } = req.body;
    const companyId = req.user.company_id;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine internal role string
    const internalRole = req.user.role.startsWith('TRANS') ? 'TRANS_SUB' : 'RCV_SUB';

    db.run(`INSERT INTO users (company_id, username, email, password_hash, role, full_name, status) VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')`,
        [companyId, username, email, hashedPassword, internalRole, full_name],
        function (err) {
            if (err) return res.status(400).json({ error: 'User exists or invalid data' });
            res.json({ message: 'Team member added', id: this.lastID });
        }
    );
};
