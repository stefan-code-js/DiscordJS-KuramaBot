module.exports = (sequelize, DataTypes) => {
    const Settings = sequelize.define('Settings', {
      key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return Settings;
  };