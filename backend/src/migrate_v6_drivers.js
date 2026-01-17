const db = require('./db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS drivers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        full_name TEXT NOT NULL,
        license_number TEXT,
        phone TEXT,
        status TEXT DEFAULT 'AVAILABLE', -- AVAILABLE, BUSY, OFF_DUTY
        id_expiry_date DATETIME,
        license_expiry_date DATETIME,
        src_expiry_date DATETIME,
        psychotechnic_expiry_date DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    console.log('Migration V6 (Drivers) completed.');
});
