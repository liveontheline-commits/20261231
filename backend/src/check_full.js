const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

console.log('--- ALL ADDRESS BOOK RECORDS (FULL LIST) ---');
db.all('SELECT * FROM address_book ORDER BY id DESC', [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Count:', rows.length);
    rows.forEach(r => {
        console.log(`ID: ${r.id} | Co: ${r.company_id} | Title: "${r.title}" | City: ${r.city}`);
    });
    db.close();
});
