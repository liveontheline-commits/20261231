const db = require('./db');
const bcrypt = require('bcrypt');

async function seedAdmin() {
    const password = await bcrypt.hash('admin123', 10);

    db.serialize(() => {
        db.run(
            `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
            ['admin', 'admin@logistics.com', password, 'ADMIN'],
            (err) => {
                if (err) {
                    console.log('Admin likely exists or error:', err.message);
                } else {
                    console.log('Admin user created: admin@logistics.com / admin123');
                }
            }
        );
    });
}

seedAdmin();
