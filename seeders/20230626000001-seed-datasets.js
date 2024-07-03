'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      await queryInterface.bulkInsert('datasets', [
        {
          id: '33333333-3333-3333-3333-333333333333',
          name: 'Bitcoin',
          symbol: 'BTC',
          createdAt: new Date('2024-06-25T16:03:52.456849'),
          updatedAt: new Date('2024-06-25T16:03:52.456849'),
        },
        {
          id: '44444444-4444-4444-4444-444444444444',
          name: 'Ethereum',
          symbol: 'ETH',
          createdAt: new Date('2024-06-25T16:03:52.456849'),
          updatedAt: new Date('2024-06-25T16:03:52.456849'),
        },
      ]);
    }
  },

  down: async (queryInterface, Sequelize) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      await queryInterface.bulkDelete('datasets', null, {});
    }
  }
};
