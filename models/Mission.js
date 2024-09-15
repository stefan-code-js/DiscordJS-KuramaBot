const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Mission extends Model {}

Mission.init({
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    objective: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize,
    modelName: 'Mission',
});

module.exports = Mission;