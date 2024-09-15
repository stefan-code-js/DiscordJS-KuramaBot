module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transfer_logs', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fromUserId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      toUserId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemType: {
        type: Sequelize.STRING, // e.g., "coins" or "item"
        allowNull: false,
      },
      itemName: {
        type: Sequelize.STRING, // e.g., "pickaxe" or "gold"
        allowNull: true,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('transfer_logs');
  }
};