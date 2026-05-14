'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Create ENUM
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_task_assignments_status"
      AS ENUM (
        'ASSIGNED',
        'IN_PROGRESS',
        'SUBMITTED',
        'COMPLETED'
      );
    `);

    // Remove old default
    await queryInterface.sequelize.query(`
      ALTER TABLE "task_assignments"
      ALTER COLUMN "status"
      DROP DEFAULT;
    `);

    // Convert STRING -> ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE "task_assignments"
      ALTER COLUMN "status"
      TYPE "enum_task_assignments_status"
      USING ("status"::text::"enum_task_assignments_status");
    `);

    // Set ENUM default
    await queryInterface.sequelize.query(`
      ALTER TABLE "task_assignments"
      ALTER COLUMN "status"
      SET DEFAULT 'ASSIGNED';
    `);
  },

  async down(queryInterface, Sequelize) {

    // Remove default
    await queryInterface.sequelize.query(`
      ALTER TABLE "task_assignments"
      ALTER COLUMN "status"
      DROP DEFAULT;
    `);

    // Convert back to STRING
    await queryInterface.changeColumn(
      'task_assignments',
      'status',
      {
        type: Sequelize.STRING,
      }
    );

    // Drop ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_task_assignments_status";
    `);
  },
};