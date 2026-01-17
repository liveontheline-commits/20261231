const db = require('./db');

db.serialize(() => {
    // 1. Create New Tables
    db.run(`CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        load_id INTEGER NOT NULL,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(load_id) REFERENCES loads(id),
        FOREIGN KEY(sender_id) REFERENCES users(id),
        FOREIGN KEY(receiver_id) REFERENCES users(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        reviewer_id INTEGER NOT NULL,
        reviewee_company_id INTEGER NOT NULL,
        load_id INTEGER NOT NULL,
        score INTEGER CHECK(score >= 1 AND score <= 5),
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(reviewer_id) REFERENCES users(id),
        FOREIGN KEY(reviewee_company_id) REFERENCES companies(id),
        FOREIGN KEY(load_id) REFERENCES loads(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS address_book (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        company_id INTEGER NOT NULL,
        title TEXT NOT NULL, -- e.g. "Main Warehouse"
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        country TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(company_id) REFERENCES companies(id)
    )`);

    // 2. Modify Existing Tables (Safely add columns if they don't exist)
    // SQLite doesn't support IF NOT EXISTS for ADD COLUMN directly in standard SQL universally in all versions easily without erroring if exists,
    // but we will try. If it fails, it might mean column exists.

    // Add default_payment_term to companies
    db.run(`ALTER TABLE companies ADD COLUMN default_payment_term TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) console.log('Column default_payment_term might already exist or error:', err.message);
        else console.log('Added default_payment_term to companies');
    });

    // Add payment_term to loads
    db.run(`ALTER TABLE loads ADD COLUMN payment_term TEXT`, (err) => {
        if (err && !err.message.includes('duplicate column')) console.log('Column payment_term might already exist or error:', err.message);
        else console.log('Added payment_term to loads');
    });

    console.log('Migration completed.');
});
