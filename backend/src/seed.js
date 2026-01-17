const db = require('./db');

const ports = [
    { name: 'Istanbul Port', country: 'Turkey', city: 'Istanbul', type: 'SEA', code: 'TRIST' },
    { name: 'Izmir Port', country: 'Turkey', city: 'Izmir', type: 'SEA', code: 'TRIZM' },
    { name: 'Mersin Port', country: 'Turkey', city: 'Mersin', type: 'SEA', code: 'TRMER' },
    { name: 'Port of Hamburg', country: 'Germany', city: 'Hamburg', type: 'SEA', code: 'DEHAM' },
    { name: 'Port of Rotterdam', country: 'Netherlands', city: 'Rotterdam', type: 'SEA', code: 'NLRTM' },
    { name: 'Trieste Port', country: 'Italy', city: 'Trieste', type: 'SEA', code: 'ITTRS' }
];

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO ports (name, country, city, type, code) VALUES (?, ?, ?, ?, ?)");
    ports.forEach(port => {
        stmt.run(port.name, port.country, port.city, port.type, port.code, (err) => {
            if (err) {
                console.log(`Skipping ${port.name}: ${err.message}`); // Likely duplicate if run twice
            } else {
                console.log(`Added ${port.name}`);
            }
        });
    });
    stmt.finalize(() => {
        console.log('Seeding completed.');
        process.exit(0);
    });
});
