import { Sequelize } from "sequelize";
import dbConfig from "./db.config";

const sequelize = new Sequelize(dbConfig.DB_NAME, dbConfig.DB_USER, dbConfig.DB_PASS, {
    host: dbConfig.DB_HOST,
    dialect: dbConfig.DB_DIALECT, // POSTGRES_VAR
    logging: dbConfig.DB_LOGGING,
});

export default sequelize;