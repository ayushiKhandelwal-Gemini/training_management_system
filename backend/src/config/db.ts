import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("tms_db", "postgres", "postgres", {
  host: "localhost",
  dialect: "postgres",
});

export default sequelize;
