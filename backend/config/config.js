require("dotenv").config();

const sslOptions =
  process.env.DB_SSL === "true"
    ? {
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }
    : {};

const fromEnv = {
  username: process.env.DB_USER ?? "postgres",
  password: process.env.DB_PASSWORD ?? "postgres",
  database: process.env.DB_NAME ?? "tms_db",
  host: process.env.DB_HOST ?? "127.0.0.1",
  port: Number(process.env.DB_PORT ?? 5432),
  dialect: "postgres",
  ...sslOptions,
};

const production = process.env.DATABASE_URL
  ? {
      use_env_variable: "DATABASE_URL",
      dialect: "postgres",
      ...sslOptions,
    }
  : fromEnv;

module.exports = {
  development: fromEnv,
  test: fromEnv,
  production,
};
