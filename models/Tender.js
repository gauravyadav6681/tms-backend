const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Tender = sequelize.define('Tender', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    bufferTime: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Optionally specify a custom table name
    tableName: 'tenders' // Change this to your desired table name if needed
});

// Export the model
module.exports = Tender;
