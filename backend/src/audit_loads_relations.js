const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

console.log("--- Loads Audit ---");
db.all("SELECT id, owner_id, status FROM loads", [], (err, loads) => {
    if (err) return console.error(err);
    console.log("LOADS:", loads);

    db.all("SELECT id, company_id FROM users", [], (err, users) => {
        if (err) return console.error(err);
        console.log("USERS:", users);

        db.all("SELECT id, name FROM companies", [], (err, cos) => {
            if (err) return console.error(err);
            console.log("COMPANIES:", cos);
            db.close();
        });
    });
});
