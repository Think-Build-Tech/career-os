import {Sequelize} from "sequelize";
import * as dotenv from "dotenv";
import config from "./config";

dotenv.config();

export const sequelize = new Sequelize(
    config.DB_NAME,
    config.DB_USER,
    config.DB_PASSWORD,
    {
        host: config.DB_HOST,
        port: config.DB_PORT,
        dialect: config.DB_DIALECT,
        dialectOptions: config.DB_SSL
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: config.DB_SSL_REJECT_UNAUTHORIZED,
                ...(config.DB_SSL_CA ? { ca: config.DB_SSL_CA } : {}),
              },
            }
          : undefined,
        logging: false,
    }
)
