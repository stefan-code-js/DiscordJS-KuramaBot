const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class UserBadges extends Model {}

UserBadges.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    badgeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize,
    modelName: 'UserBadges',
});

module.exports = UserBadges;