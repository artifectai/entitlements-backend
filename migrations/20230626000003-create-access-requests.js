'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('access-requests', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
      frequencyId: {
        type: Sequelize.UUID,
        allowNull: false,
        field: 'frequency_id',
        references: {
          model: 'frequencies',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requestedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        field: 'requested_at'
      },
      resolvedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'resolved_at'
      },
      expiryDate: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'expiry_date'
      },
      isTemporary: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_temporary'
      },
    });

    await queryInterface.addIndex('access-requests', ['user_id', 'dataset_id', 'frequency_id'], {
      unique: true,
      name: 'access_requests_user_dataset_frequency_idx'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('access-requests');
  }
};
