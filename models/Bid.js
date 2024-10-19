const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Adjust the path according to your project structure
const Bid = sequelize.define('Bid', {
    tender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tenders', // Ensure this matches the name of the tender table
            key: 'id'
        }
    },
    company_name: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    bid_cost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },
    bid_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    is_flagged: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'bids', // This should match your actual bids table
    timestamps: false // Disable timestamps if not needed
});
module.exports = Bid;
