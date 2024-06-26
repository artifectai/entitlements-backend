'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('frequencies', [
      {
        id: '55555555-5555-5555-5555-555555555555',
        dataset_id: '33333333-3333-3333-3333-333333333333',
        frequency: 'd1',
        market_cap_usd: 60000000000,
        createdAt: new Date('2024-06-25T16:03:52.456Z'),
        updatedAt: new Date('2024-06-25T16:03:52.456Z'),
      },
      {
        id: '66666666-6666-6666-6666-666666666666',
        dataset_id: '33333333-3333-3333-3333-333333333333',
        frequency: 'h1',
        market_cap_usd: 60000000000,
        createdAt: new Date('2024-06-25T16:03:52.456Z'),
        updatedAt: new Date('2024-06-25T16:03:52.456Z'),
      },
      {
        id: '77777777-7777-7777-7777-777777777777',
        dataset_id: '33333333-3333-3333-3333-333333333333',
        frequency: 'm1',
        market_cap_usd: 60000000000,
        createdAt: new Date('2024-06-25T16:03:52.456Z'),
        updatedAt: new Date('2024-06-25T16:03:52.456Z'),
      },
      {
        id: '88888888-8888-8888-8888-888888888888',
        dataset_id: '44444444-4444-4444-4444-444444444444',
        frequency: 'd1',
        market_cap_usd: 25000000000,
        createdAt: new Date('2024-06-25T16:03:52.456Z'),
        updatedAt: new Date('2024-06-25T16:03:52.456Z'),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('frequencies', null, {});
  }
};
