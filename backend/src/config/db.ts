import { DataSource } from "typeorm";

export const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "db",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ["src/entities/*.ts"],
  migrations: [__dirname + "/migrations/*.{js,ts}"],
  migrationsRun: true,
  synchronize: process.env.NODE_ENV !== "production",
  logging:
    process.env.NODE_ENV !== "production" ? ["query", "error"] : ["error"],
});
