import { Dialect } from "sequelize";

const dbConfig = {
    DB_NAME: process.env.PG_DB_NAME ?? "",
    DB_HOST: process.env.PG_DB_HOST ?? "",
    DB_USER: process.env.DB_USER ?? "",
    DB_PASS: process.env.DB_PASS ?? "",
    DB_DIALECT: process.env.DB_DIALECT as Dialect ?? "postgres",
    DB_LOGGING: Boolean(process.env.DB_LOGGING) ?? true,
}

export default dbConfig;