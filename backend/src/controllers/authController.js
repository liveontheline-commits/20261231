const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'secret';

// Helper to wrap db.run in a promise (for inserts/updates)
function runQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.run(query, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}

// Helper to wrap db.get in a promise (for selecting one)
function getQuery(query, params = []) {
    return new Promise((resolve, reject) => {
        db.get(query, params, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

exports.register = async (req, res) => {
    const { company_name, company_type, username, email, password } = req.body;

    if (!company_name || !company_type || !username || !email || !password) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!['TRANSPORTER', 'RECEIVER'].includes(company_type)) {
        return res.status(400).json({ error: 'Invalid company type.' });
    }

    try {
        // Simple transaction simulation (SQLite serializes operations by default, but error handling is key)

        // 1. Create Company
        const companyResult = await runQuery(
            `INSERT INTO companies (name, type) VALUES (?, ?)`,
            [company_name, company_type]
        );
        const companyId = companyResult.lastID;

        // 2. Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Determine Role based on Company Type
        const role = company_type === 'TRANSPORTER' ? 'TRANS_MAIN' : 'RCV_MAIN';

        // 4. Create User
        await runQuery(
            `INSERT INTO users (company_id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
            [companyId, username, email, hashedPassword, role]
        );

        res.status(201).json({ message: 'Registration successful.' });

    } catch (error) {
        console.error('Registration Error:', error);
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ error: 'Username or Email already exists.' });
        }
        res.status(500).json({ error: 'Server error during registration.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
        const user = await getQuery(`SELECT * FROM users WHERE email = ?`, [email]);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, company_id: user.company_id },
            SECRET_KEY,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                company_id: user.company_id
            }
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login.' });
    }
};