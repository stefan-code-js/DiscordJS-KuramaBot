const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Achievement extends Model {}

Achievement.init({
    badgeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    badgeIcon: {
        type: DataTypes.STRING,
        allowNull: false, // Store the emoji or icon for the badge
    },
    userId: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'userId',
        },
    },
}, {
    sequelize,
    modelName: 'Achievement',
});

module.exports = Achievement;