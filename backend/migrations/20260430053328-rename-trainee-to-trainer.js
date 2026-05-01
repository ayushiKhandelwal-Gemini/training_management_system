'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface) => {
    // 1. Rename existing enum
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role" RENAME TO "enum_Users_role_old";
    `);

    // 2. Create new enum with updated value
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role" AS ENUM ('TRAINER', 'STUDENT');
    `);

    // 3. Update the column to use the new enum
    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ALTER COLUMN "role"
      TYPE "enum_Users_role"
      USING "role"::text::"enum_Users_role";
    `);

    // 4. Drop the old enum
    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Users_role_old";
    `);
  },

  down: async (queryInterface) => {
    // Rollback (restore TRAINEE)
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_Users_role_old" AS ENUM ('TRAINEE', 'STUDENT');
    `);

    await queryInterface.sequelize.query(`
      ALTER TABLE "Users"
      ALTER COLUMN "role"
      TYPE "enum_Users_role_old"
      USING "role"::text::"enum_Users_role_old";
    `);

    await queryInterface.sequelize.query(`
      DROP TYPE "enum_Users_role";
    `);

    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_Users_role_old" RENAME TO "enum_Users_role";
    `);
  },
};