module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    itemId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    itemName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  });

  return Item;
};