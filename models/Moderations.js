module.exports = (sequelize, DataTypes) => {
    const Moderations = sequelize.define('Moderations', {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      moderatorId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reason: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true,
      }
    });
  
    return Moderations;
};