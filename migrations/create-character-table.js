module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Characters', {
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            characterName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            ability: {
                type: Sequelize.STRING,
                allowNull: false,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Characters');
    }
};