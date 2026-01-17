const db = require('../db');

// Post Empty Vehicle Availability
exports.postEmptyVehicle = (req, res) => {
    const { vehicle_id, available_city, available_date, preferred_destination, min_price } = req.body;

    db.run(`INSERT INTO empty_vehicles (vehicle_id, available_city, available_date, preferred_destination_city, min_price) VALUES (?, ?, ?, ?, ?)`,
        [vehicle_id, available_city, available_date, preferred_destination, min_price],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'DB Error' });
            }
            res.json({ message: 'Empty Vehicle Posted', id: this.lastID });
        }
    );
};

// Find Loads Matching an Empty Vehicle
exports.findMatches = (req, res) => {
    const { city, date } = req.query;

    const sql = `
        SELECT l.*, c.name as company_name 
        FROM loads l
        JOIN companies c ON l.owner_id = c.id
        WHERE l.status = 'OPEN' 
        AND l.origin_city LIKE ? 
        AND date(l.pickup_date) >= date(?)
        ORDER BY l.pickup_date ASC
    `;

    db.all(sql, [`%${city}%`, date], (err, rows) => {
        if (err) return res.status(500).json({ error: 'DB Error' });
        res.json(rows);
    });
};

// Get Market Trends for Smart Bidding (Improved)
exports.getMarketTrends = (req, res) => {
    const { origin, destination } = req.query;

    const sql = `
        SELECT AVG(amount) as avg_price, MIN(amount) as min_price, MAX(amount) as max_price
        FROM bids b
        JOIN loads l ON b.load_id = l.id
        WHERE l.origin_city LIKE ? AND l.destination_city LIKE ?
        AND b.status = 'ACCEPTED'
    `;

    db.get(sql, [`%${origin}%`, `%${destination}%`], (err, row) => {
        if (err || !row.avg_price) {
            // Return defaults if no history
            return res.json({
                average_price: 1200,
                lowest_bid_last_week: 1100,
                highest_bid_last_week: 1400,
                demand_level: 'MEDIUM',
                price_history: [1150, 1200, 1220, 1180, 1250]
            });
        }

        res.json({
            average_price: Math.round(row.avg_price),
            lowest_bid_last_week: Math.round(row.min_price),
            highest_bid_last_week: Math.round(row.max_price),
            demand_level: 'HIGH',
            price_history: [row.min_price, (row.min_price + row.avg_price) / 2, row.avg_price, (row.max_price + row.avg_price) / 2, row.max_price]
        });
    });
};

// One-Click Bid Implementation
exports.oneClickBid = (req, res) => {
    const { load_id, amount } = req.body;
    const transporter_id = req.user.id;

    db.run(`INSERT INTO bids (load_id, transporter_id, amount, status) VALUES (?, ?, ?, 'PENDING')`,
        [load_id, transporter_id, amount],
        function (err) {
            if (err) return res.status(500).json({ error: 'Failed to place bid' });
            res.json({ message: 'Smart Bid Placed', bid_id: this.lastID });
        }
    );
};
