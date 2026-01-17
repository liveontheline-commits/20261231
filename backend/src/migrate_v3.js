const db = require('./db');

db.serialize(() => {
    // Tracking Updates Table
    db.run(`CREATE TABLE IF NOT EXISTS tracking_updates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        load_id INTEGER NOT NULL,
        status TEXT NOT NULL, -- e.g., 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'
        location TEXT, -- City, Country or GPS coordinates
        note TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(load_id) REFERENCES loads(id)
    )`);

    console.log('Migration V3 (Tracking) completed.');
});
