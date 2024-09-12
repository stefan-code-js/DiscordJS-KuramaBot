module.exports = (sequelize, DataTypes) => {
    const ReactionRoles = sequelize.define('ReactionRoles', {
      text: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emoji: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roleId: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      timestamps: true,  // Adds 'createdAt' and 'updatedAt' fields automatically
      tableName: 'ReactionRoles',  // Explicit table name
    });
  
    return ReactionRoles;
  };