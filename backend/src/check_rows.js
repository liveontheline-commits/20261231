const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/logistics.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT * FROM address_book', [], (err, rows) => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('Total Address Records:', rows.length);
    rows.forEach(row => {
        console.log(`ID: ${row.id} | CoID: ${row.company_id} | Title: ${row.title} | City: ${row.city}`);
    });
    db.close();
});
