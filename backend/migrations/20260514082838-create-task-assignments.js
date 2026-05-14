'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task_assignments', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      task_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      student_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users', // your table name
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      trainer_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'ASSIGNED',
      },

      assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addConstraint('task_assignments', {
      fields: ['task_id', 'student_id'],
      type: 'unique',
      name: 'unique_task_student',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task_assignments');
  },
};
