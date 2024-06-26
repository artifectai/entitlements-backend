'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('frequencies', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      datasetId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'dataset_id',
        references: {
          model: 'datasets',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      frequency: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      marketCapUsd: {
        type: Sequelize.DECIMAL(20, 2),
        allowNull: true,
        field: 'market_cap_usd'
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
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('frequencies');
  }
};
