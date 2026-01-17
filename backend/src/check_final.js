const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

console.log('--- ALL Address Book Records ---');
db.all('SELECT * FROM address_book', [], (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.table(rows);
    }

    console.log('\n--- Current User Data Check ---');
    db.all('SELECT id, username, company_id, role FROM users', [], (err, rows) => {
        if (err) {
            console.error(err);
        } else {
            console.table(rows);
        }
        db.close();
    });
});
