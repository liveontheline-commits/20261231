const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

db.all("PRAGMA table_info(loads)", [], (err, rows) => {
    if (err) console.error(err);
    else console.table(rows);
    db.close();
});
