const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

db.all("SELECT sql FROM sqlite_master WHERE type='table' AND name='address_book'", [], (err, rows) => {
    if (err) console.error(err);
    else console.log('TABLE SCHEMA:', rows[0].sql);

    db.all("SELECT * FROM sqlite_master WHERE type='trigger' AND tbl_name='address_book'", [], (err, rows) => {
        if (err) console.error(err);
        else {
            console.log('TRIGGERS:', rows.length);
            rows.forEach(r => console.log(r.sql));
        }
        db.close();
    });
});
