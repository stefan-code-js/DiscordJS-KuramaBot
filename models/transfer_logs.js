module.exports = (sequelize, DataTypes) => {
    const TransferLogs = sequelize.define('TransferLogs', {
      fromUserId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      toUserId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemType: {
        type: DataTypes.STRING, // coins, item, etc.
        allowNull: false,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    });
  
    return TransferLogs;
  };