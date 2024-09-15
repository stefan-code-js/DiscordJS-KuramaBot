module.exports = (sequelize, DataTypes) => {
  const Equipment = sequelize.define('Equipment', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false, // Ensure it's not nullable
    },
    durability: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100, // Initial durability
    },
  }, {
    sequelize,
    modelName: 'Equipment',
  });
  return Equipment;
};