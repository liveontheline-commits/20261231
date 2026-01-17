
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database/logistics.db');
const db = new sqlite3.Database(dbPath);

console.log('--- LOADS ---');
db.all("SELECT * FROM loads", [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log(JSON.stringify(rows, null, 2));

    console.log('--- USERS ---');
    db.all("SELECT id, username, role FROM users", [], (err, urows) => {
        if (err) console.error(err);
        else console.log(JSON.stringify(urows, null, 2));
        db.close();
    });
});
