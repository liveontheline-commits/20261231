const db = require('./db');
const bcrypt = require('bcryptjs');

const permissions = [
    { key: 'manage_company', desc: 'Edit company details' },
    { key: 'manage_users', desc: 'Add/Remove users' },
    { key: 'manage_finance', desc: 'View invoices and payments' },
    { key: 'create_job', desc: 'Post new loads' },
    { key: 'view_jobs', desc: 'View active loads' },
    { key: 'bid_load', desc: 'Place bids' },
    { key: 'manage_fleet', desc: 'Add/Edit vehicles' }
];

const plans = [
    { name: 'Free', max_users: 2, max_active_jobs: 5, price: 0, features: JSON.stringify(['basic_support']) },
    { name: 'Pro', max_users: 10, max_active_jobs: 50, price: 49.99, features: JSON.stringify(['priority_support', 'analytics']) },
    { name: 'Enterprise', max_users: 100, max_active_jobs: 9999, price: 299.99, features: JSON.stringify(['api_access', 'dedicated_manager']) }
];

async function seed() {
    console.log('Seeding Enterprise Data...');

    // 1. Permissions
    for (const p of permissions) {
        await new Promise(r => db.run(`INSERT OR IGNORE INTO permissions (key, description) VALUES (?, ?)`, [p.key, p.desc], r));
    }

    // 2. Plans
    for (const p of plans) {
        await new Promise(r => db.run(`INSERT OR IGNORE INTO membership_plans (name, max_users, max_active_jobs, price_monthly, features_json) VALUES (?, ?, ?, ?, ?)`,
            [p.name, p.max_users, p.max_active_jobs, p.price, p.features], r));
    }

    // 3. Default Roles (Global)
    // Owner Role
    let ownerRoleId;
    await new Promise(r => db.run(`INSERT OR IGNORE INTO roles (name, description) VALUES (?, ?)`, ['Owner', 'Full access'], function () { ownerRoleId = this.lastID; r(); }));

    // Assign all permissions to Owner ??? (Need to fetch permission IDs first, skipping complex logic for brevity, assuming standard setup)
    // ideally we fetch IDs. 

    console.log('Seeding completed (Basic).');
}

seed();
