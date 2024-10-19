const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const tenderRoutes = require('./routes/tenderRoutes');
const userRoutes = require('./routes/userRoutes'); // Correct path to userRoutes


const app = express();
app.use(cors());
app.use(express.json());

// Use your routes
app.use('/api',tenderRoutes);
app.use('/api/users', userRoutes); // Add a base route like /api/users

// Sync database and start server
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Database connection failed:', err);
});
