'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [
      {
        id: '11111111-1111-1111-1111-111111111111',
        api_key: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
        role: 'Quant',
        createdAt: new Date('2024-06-25T16:03:52.456849'),
        updatedAt: new Date('2024-06-25T16:03:52.456849'),
      },
      {
        id: '22222222-2222-2222-2222-222222222222',
        api_key: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb2',
        role: 'Ops',
        createdAt: new Date('2024-06-25T16:03:52.456849'),
        updatedAt: new Date('2024-06-25T16:03:52.456849'),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};
