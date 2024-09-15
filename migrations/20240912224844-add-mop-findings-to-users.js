module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'mop_findings', {
      type: Sequelize.JSON,
      defaultValue: [],
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'mop_findings');
  }
};
