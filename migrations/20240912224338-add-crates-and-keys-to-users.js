module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'crates', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
    await queryInterface.addColumn('Users', 'keys', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'crates');
    await queryInterface.removeColumn('Users', 'keys');
  },
};