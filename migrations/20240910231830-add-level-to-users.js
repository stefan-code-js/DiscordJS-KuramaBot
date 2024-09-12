'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'level', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Ensure all users have a default level of 1
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'level');
  }
};