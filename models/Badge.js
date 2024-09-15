const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Badge extends Model {}

Badge.init({
    userId: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'userId',
        },
    },
    badgeName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    badgeIcon: {
        type: DataTypes.STRING,
        allowNull: false, // Badge icon or emoji
    },
}, {
    sequelize,
    modelName: 'Badge',
});

module.exports = Badge;