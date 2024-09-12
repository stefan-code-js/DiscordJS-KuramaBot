'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `inventory` column to the `Users` table
    await queryInterface.addColumn('Users', 'inventory', {
      type: Sequelize.TEXT, // Store inventory as JSON (string)
      allowNull: true,
      defaultValue: JSON.stringify({}), // Initialize with empty inventory
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the `inventory` column if the migration is rolled back
    await queryInterface.removeColumn('Users', 'inventory');
  }
};