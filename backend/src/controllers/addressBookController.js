const fs = require('fs');
const path = require('path');

function logToFile(msg) {
    const logPath = path.resolve(__dirname, '../../api_debug.log');
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logPath, `[${timestamp}] ${msg}\n`);
}

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

exports.getAddressBook = async (req, res) => {
    const user = req.user;
    logToFile(`GET /address-book - User: ${user.id}, CoID: ${user.company_id}`);

    try {
        let addresses;
        if (user.role === 'ADMIN') {
            logToFile('Admin access: fetching all');
            addresses = await allQuery(`SELECT * FROM address_book`);
        } else {
            if (user.company_id === null || user.company_id === undefined) {
                logToFile('No CoID found');
                return res.json([]);
            }
            const coId = parseInt(user.company_id, 10);
            logToFile(`Querying for CoID: ${coId}`);
            addresses = await allQuery(`SELECT * FROM address_book WHERE company_id = ?`, [coId]);
        }

        logToFile(`Found ${addresses.length} addresses.`);
        res.json(addresses);
    } catch (err) {
        console.error('Database Error in getAddressBook:', err);
        res.status(500).json({ error: 'Failed to fetch addresses' });
    }
};

exports.addAddress = async (req, res) => {
    const { title, address, city, country } = req.body;
    const user = req.user;
    logToFile(`POST /address-book - User: ${user.id}, CoID: ${user.company_id}, Payload: ${JSON.stringify(req.body)}`);

    if (!title || !address || !city || !country) {
        logToFile('Missing fields error');
        return res.status(400).json({ error: 'All fields (title, address, city, country) are required' });
    }

    try {
        const coId = user.company_id ? parseInt(user.company_id, 10) : null;
        if (coId === null) {
            logToFile('Fail: No company ID');
            return res.status(400).json({ error: 'You must be associated with a company to save addresses.' });
        }

        logToFile(`Inserting for CoID: ${coId}`);
        await runQuery(
            `INSERT INTO address_book (company_id, title, address, city, country) VALUES (?, ?, ?, ?, ?)`,
            [coId, title, address, city, country]
        );
        logToFile('Success: Address saved');
        res.json({ message: 'Address added' });
    } catch (err) {
        logToFile(`DB ERROR: ${err.message}`);
        res.status(500).json({ error: 'Database failure: ' + err.message });
    }
};
