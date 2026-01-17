const db = require('./db');

db.serialize(() => {
    // 1. Roles & Permissions (RBAC)
    db.run(`CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        company_id INTEGER, -- NULL for Global Roles (e.g. Admin), Set for Company-specific roles
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL, -- e.g. 'manage_users', 'view_finance'
        description TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        FOREIGN KEY(role_id) REFERENCES roles(id),
        FOREIGN KEY(permission_id) REFERENCES permissions(id),
        PRIMARY KEY (role_id, permission_id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS user_roles (
        user_id INTEGER NOT NULL,
        role_id INTEGER NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY(role_id) REFERENCES roles(id),
        PRIMARY KEY (user_id, role_id)
    )`);

    // 2. Company Plans
    db.run(`CREATE TABLE IF NOT EXISTS membership_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL, -- Free, Pro, Enterprise
        max_users INTEGER,
        max_active_jobs INTEGER,
        price_monthly REAL,
        features_json TEXT -- JSON string of features
    )`);

    db.run(`ALTER TABLE companies ADD COLUMN plan_id INTEGER REFERENCES membership_plans(id) DEFAULT 1`, (err) => {
        if (!err) console.log('Added plan_id to companies');
    });

    // 3. Advanced Job Features
    db.run(`CREATE TABLE IF NOT EXISTS job_routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        type TEXT NOT NULL, -- 'LOADING', 'UNLOADING'
        sequence_order INTEGER, -- 1, 2, 3...
        city TEXT NOT NULL,
        address TEXT,
        date DATETIME,
        FOREIGN KEY(job_id) REFERENCES loads(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS price_estimations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        job_id INTEGER NOT NULL,
        min_price REAL,
        max_price REAL,
        suggested_price REAL,
        confidence_score INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(job_id) REFERENCES loads(id)
    )`);

    // 4. Empty Vehicles
    db.run(`CREATE TABLE IF NOT EXISTS empty_vehicles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vehicle_id INTEGER NOT NULL,
        available_city TEXT NOT NULL,
        available_date DATETIME NOT NULL,
        preferred_destination_city TEXT,
        min_price REAL,
        status TEXT DEFAULT 'OPEN', -- OPEN, MATCHED, EXPIRED
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(vehicle_id) REFERENCES vehicles(id)
    )`);

    console.log('Migration V4 (Enterprise) completed.');
});
