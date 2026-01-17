const db = require('./db');

async function migrate_v5() {
    console.log('Migrating v5: Adding load_stops table...');

    db.run(`
        CREATE TABLE IF NOT EXISTS load_stops (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            load_id INTEGER NOT NULL,
            type TEXT CHECK(type IN ('PICKUP', 'DROP')) NOT NULL,
            city TEXT NOT NULL,
            country TEXT,
            sequence_order INTEGER NOT NULL, -- 1, 2, 3...
            weight_kg INTEGER, -- Weight to pick up or drop off at this stop
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(load_id) REFERENCES loads(id) ON DELETE CASCADE
        );
    `, (err) => {
        if (err) console.error('Error creating load_stops:', err);
        else console.log('load_stops table created successfully.');
    });
}

migrate_v5();
