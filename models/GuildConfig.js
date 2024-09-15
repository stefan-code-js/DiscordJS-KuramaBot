const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class GuildConfig extends Model {}

GuildConfig.init({
    guildId: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    welcomeChannelId: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    autoRoleId1: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    autoRoleId2: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    autoRoleId3: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: 'GuildConfig',
    timestamps: false,
});

module.exports = GuildConfig;