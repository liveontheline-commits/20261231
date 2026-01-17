const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT * FROM address_book", [], (err, rows) => {
    if (err) console.error(err);
    else {
        rows.forEach(r => {
            console.log(`ID: ${r.id} | Co: ${r.company_id} | Title: ${r.title} | Created: ${r.created_at}`);
        });
    }
    db.close();
});
