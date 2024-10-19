// models/User.js
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'), // Use enum for roles
        allowNull: false,
        defaultValue: 'user',
    },
}, {
    sequelize,
    modelName: 'user',
    timestamps: false, // Disable timestamps
    
});

module.exports = User;
