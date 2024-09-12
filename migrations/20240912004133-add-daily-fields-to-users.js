'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add the `coins`, `streak`, and `lastClaimed` columns to the `Users` table
    await queryInterface.addColumn('Users', 'coins', {
      type: Sequelize.BIGINT,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'streak', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    await queryInterface.addColumn('Users', 'lastClaimed', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the columns if the migration is rolled back
    await queryInterface.removeColumn('Users', 'coins');
    await queryInterface.removeColumn('Users', 'streak');
    await queryInterface.removeColumn('Users', 'lastClaimed');
  }
};