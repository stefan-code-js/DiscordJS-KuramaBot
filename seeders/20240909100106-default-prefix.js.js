'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Settings', [{
        key: 'prefix',
        value: '!', // Your default prefix
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    },
    down: async (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete('Settings', { key: 'prefix' }, {});
    }
  };
