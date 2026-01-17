-- Users and Authentication
CREATE TABLE IF NOT EXISTS companies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    type TEXT CHECK(type IN ('TRANSPORTER', 'RECEIVER')) NOT NULL,
    contact_email TEXT,
    phone TEXT,
    address TEXT,
    verification_status TEXT DEFAULT 'PENDING', -- PENDING, VERIFIED, REJECTED
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('TRANS_MAIN', 'TRANS_SUB', 'RCV_MAIN', 'RCV_SUB', 'ADMIN')) NOT NULL,
    full_name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id)
);

-- Core Business Entities
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    plate_number TEXT NOT NULL,
    type TEXT NOT NULL, -- e.g., 'Van', 'Truck', 'Trailer'
    capacity_kg INTEGER,
    current_location TEXT,
    status TEXT DEFAULT 'EMPTY', -- EMPTY, FULL, MAINTENANCE
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id)
);

CREATE TABLE IF NOT EXISTS ports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    type TEXT DEFAULT 'SEA', -- SEA, RAIL, AIR
    code TEXT, -- UN/LOCODE e.g., TRIST
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS loads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL, -- The user (Service Receiver) who posted this
    origin_city TEXT,
    origin_country TEXT NOT NULL,
    origin_port_id INTEGER, -- Optional: if pickup is at a port
    destination_city TEXT,
    destination_country TEXT NOT NULL,
    destination_port_id INTEGER, -- Optional: if delivery is at a port
    pickup_date DATETIME NOT NULL,
    delivery_date DATETIME,
    weight_kg INTEGER,
    volume_m3 REAL,
    goods_type TEXT,
    vehicle_type_required TEXT,
    status TEXT DEFAULT 'OPEN', -- OPEN, ASSIGNED, IN_TRANSIT, COMPLETED, CANCELLED
    estimated_price REAL, -- The target price set by the receiver
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id),
    FOREIGN KEY(origin_port_id) REFERENCES ports(id),
    FOREIGN KEY(destination_port_id) REFERENCES ports(id)
);

CREATE TABLE IF NOT EXISTS load_stops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id INTEGER NOT NULL,
    type TEXT CHECK(type IN ('PICKUP', 'DROP')) NOT NULL,
    city TEXT NOT NULL,
    country TEXT,
    sequence_order INTEGER NOT NULL, -- 1, 2, 3...
    weight_kg INTEGER, -- Weight to pick up or drop off at this stop
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(load_id) REFERENCES loads(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bids (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    load_id INTEGER NOT NULL,
    transporter_id INTEGER NOT NULL, -- The user (Transporter) who made the bid
    amount REAL NOT NULL,
    currency TEXT DEFAULT 'EUR',
    status TEXT DEFAULT 'PENDING', -- PENDING, ACCEPTED, REJECTED
    message TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(load_id) REFERENCES loads(id),
    FOREIGN KEY(transporter_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS address_book (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(company_id) REFERENCES companies(id)
);
