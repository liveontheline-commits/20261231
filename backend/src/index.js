require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes (to be imported)
const authRoutes = require('./routes/auth');
const loadRoutes = require('./routes/loads');
const bidRoutes = require('./routes/bids');
const vehicleRoutes = require('./routes/vehicles');
const adminRoutes = require('./routes/admin');
const dashboardRoutes = require('./routes/dashboard');
const advancedRoutes = require('./routes/advanced');
const trackingRoutes = require('./routes/tracking');
const enterpriseRoutes = require('./routes/enterprise');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/loads', loadRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/features', advancedRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/enterprise', enterpriseRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/', (req, res) => {
    res.send('Logistics Platform API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
