module.exports = (sequelize, DataTypes) => {
  const Inventory = sequelize.define('Inventory', {
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
  });

  Inventory.associate = (models) => {
    // Define associations here
    Inventory.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' }); // Ensure Users is defined correctly
    Inventory.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });  // Ensure Item is defined correctly
  };

  return Inventory;
};