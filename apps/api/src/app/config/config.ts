import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "apps/api/.env") });
dotenv.config({ path: path.resolve(__dirname, "../../apps/api/.env") });
dotenv.config();

const config = {
  DB_NAME: process.env.DB_NAME || "careeros_dev",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: Number(process.env.DB_PORT || "5432"),
  DB_DIALECT: (process.env.DB_DIALECT || "postgres") as Dialect,
};

export default config;