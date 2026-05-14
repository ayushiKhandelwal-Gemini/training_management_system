'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    // Create ENUM
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_submissions_status"
      AS ENUM (
        'SUBMITTED',
        'UNDER_REVIEW',
        'REVIEWED',
        'RESUBMIT_REQUIRED'
      );
    `);

    // Remove old default
    await queryInterface.sequelize.query(`
      ALTER TABLE "submissions"
      ALTER COLUMN "status"
      DROP DEFAULT;
    `);

    // Convert STRING -> ENUM
    await queryInterface.sequelize.query(`
      ALTER TABLE "submissions"
      ALTER COLUMN "status"
      TYPE "enum_submissions_status"
      USING ("status"::text::"enum_submissions_status");
    `);

    // Set ENUM default
    await queryInterface.sequelize.query(`
      ALTER TABLE "submissions"
      ALTER COLUMN "status"
      SET DEFAULT 'SUBMITTED';
    `);
  },

  async down(queryInterface, Sequelize) {

    // Remove default
    await queryInterface.sequelize.query(`
      ALTER TABLE "submissions"
      ALTER COLUMN "status"
      DROP DEFAULT;
    `);

    // Convert back to STRING
    await queryInterface.changeColumn(
      'submissions',
      'status',
      {
        type: Sequelize.STRING,
      }
    );

    // Drop ENUM
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_submissions_status";
    `);
  },
};