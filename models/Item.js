const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Item extends Model {}

Item.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    value: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    rarity: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false, // e.g., 'fish', 'tool', 'mineral'
    },
}, {
    sequelize,
    modelName: 'Item',
});

module.exports = Item;