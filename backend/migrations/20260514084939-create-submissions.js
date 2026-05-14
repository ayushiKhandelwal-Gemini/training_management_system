'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('submissions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      assignment_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'task_assignments',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      file_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'SUBMITTED',
      },

      submitted_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      marks: {
        type: Sequelize.INTEGER,
      },

      remarks: {
        type: Sequelize.TEXT,
      },

      reviewed_at: {
        type: Sequelize.DATE,
      },

      reviewed_by: {
        type: Sequelize.UUID,
        references: {
          model: 'Users', 
          key: 'id',
        },
        onDelete: 'SET NULL',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('submissions');
  },
};