'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      apiKey: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'api_key'
      },
      role: {
        type: Sequelize.ENUM('Quant', 'Ops'),
        allowNull: false,
        field: 'role'
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
    await queryInterface.addIndex('users', ['role'], {
      name: 'users_role_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
