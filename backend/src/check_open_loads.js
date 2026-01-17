const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM loads WHERE status = 'OPEN'", [], (err, rows) => {
    if (err) console.error(err);
    else {
        console.log(`Found ${rows.length} OPEN loads.`);
        rows.forEach(r => {
            console.log(`ID: ${r.id} | Origin: ${r.origin_city} | Dest: ${r.destination_city} | Status: ${r.status}`);
        });
    }
    db.close();
});
