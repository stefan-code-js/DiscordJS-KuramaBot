const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Character

 extends Model {}

Character.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    characterName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ability: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize,
    modelName: 'Character',
});

module.exports = Character;