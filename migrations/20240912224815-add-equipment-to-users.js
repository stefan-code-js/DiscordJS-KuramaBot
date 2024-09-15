module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'equipment', {
      type: Sequelize.JSON,
      defaultValue: {},
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'equipment');
  }
};