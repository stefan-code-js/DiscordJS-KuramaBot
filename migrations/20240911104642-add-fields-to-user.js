'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Get the existing table structure
    const table = await queryInterface.describeTable('Users');

    // Add columns only if they don't exist
    if (!table.badge) {
      await queryInterface.addColumn('Users', 'badge', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      });
    }

    if (!table.reputation) {
      await queryInterface.addColumn('Users', 'reputation', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.credits) {
      await queryInterface.addColumn('Users', 'credits', {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.legacyCredits) {
      await queryInterface.addColumn('Users', 'legacyCredits', {
        type: Sequelize.BIGINT,
        allowNull: false,
        defaultValue: 0,
      });
    }

    if (!table.birthday) {
      await queryInterface.addColumn('Users', 'birthday', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      });
    }

    if (!table.badges) {
      await queryInterface.addColumn('Users', 'badges', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '',
      });
    }

    if (!table.timezone) {
      await queryInterface.addColumn('Users', 'timezone', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'Unknown',
      });
    }

    if (!table.xp) {
      await queryInterface.addColumn('Users', 'xp', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the columns if the migration is rolled back
    await queryInterface.removeColumn('Users', 'badge');
    await queryInterface.removeColumn('Users', 'reputation');
    await queryInterface.removeColumn('Users', 'credits');
    await queryInterface.removeColumn('Users', 'legacyCredits');
    await queryInterface.removeColumn('Users', 'birthday');
    await queryInterface.removeColumn('Users', 'badges');
    await queryInterface.removeColumn('Users', 'timezone');
    await queryInterface.removeColumn('Users', 'xp');
  }
};