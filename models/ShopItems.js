const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ShopItem extends Model {}

ShopItem.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    buyPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    sellPrice: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false, // Emoji or icon for the item
    },
}, {
    sequelize,
    modelName: 'ShopItem',
});

module.exports = ShopItem;