import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

export const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      dialect: "postgres",
      dialectOptions:
        process.env.DB_SSL === "true"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false,
              },
            }
          : undefined,
    })
  : new Sequelize(
      process.env.DB_NAME ?? "tms_db",
      process.env.DB_USER ?? "postgres",
      process.env.DB_PASSWORD ?? "12345",
      {
        host: process.env.DB_HOST ?? "localhost",
        port: Number(process.env.DB_PORT ?? 5432),
        dialect: "postgres",
      }
    );

export default sequelize;
