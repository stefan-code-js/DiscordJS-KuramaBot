module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Badges', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            description: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        await queryInterface.createTable('UserBadges', {
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            badgeId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Badges',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('UserBadges');
        await queryInterface.dropTable('Badges');
    }
};