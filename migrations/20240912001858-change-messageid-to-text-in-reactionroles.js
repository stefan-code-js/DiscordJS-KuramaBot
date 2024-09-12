'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // Change 'messageId' to 'text'
    await queryInterface.renameColumn('ReactionRoles', 'messageId', 'text');
    await queryInterface.changeColumn('ReactionRoles', 'text', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse the change if the migration is rolled back
    await queryInterface.renameColumn('ReactionRoles', 'text', 'messageId');
  }
};