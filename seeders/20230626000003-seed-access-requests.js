'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('access-requests', [
      {
        id: '99999999-9999-9999-9999-999999999999',
        user_id: '11111111-1111-1111-1111-111111111111',
        dataset_id: '33333333-3333-3333-3333-333333333333',
        frequency_id: '55555555-5555-5555-5555-555555555555',
        status: 'approved',
        requested_at: new Date('2024-01-01T00:00:00.000Z'),
        resolved_at: new Date('2024-01-02T00:00:00.000Z'),
        expiry_date: new Date('2024-06-26T00:00:00.000Z'),
        is_temporary: true,
      },
      {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        user_id: '11111111-1111-1111-1111-111111111111',
        dataset_id: '44444444-4444-4444-4444-444444444444',
        frequency_id: '88888888-8888-8888-8888-888888888888',
        status: 'pending',
        requested_at: new Date('2024-01-03T00:00:00.000Z'),
        resolved_at: null,
        expiry_date: null,
        is_temporary: false,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('access-requests', null, {});
  }
};
