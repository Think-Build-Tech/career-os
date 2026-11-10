import { Dialect } from "sequelize";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "apps/api/.env") });
dotenv.config({ path: path.resolve(__dirname, "../../apps/api/.env") });
dotenv.config();

function asBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
}

const dbHost = process.env.DB_HOST || "localhost";
const localDatabaseHosts = new Set(["localhost", "127.0.0.1", "::1", "postgres"]);
const dbSslCa = process.env.DB_SSL_CA?.replace(/\\n/g, "\n");

const config = {
  DB_NAME: process.env.DB_NAME || "careeros_dev",
  DB_USER: process.env.DB_USER || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "postgres",
  DB_HOST: dbHost,
  DB_PORT: Number(process.env.DB_PORT || "5432"),
  DB_DIALECT: (process.env.DB_DIALECT || "postgres") as Dialect,
  DB_SSL: asBoolean(process.env.DB_SSL, !localDatabaseHosts.has(dbHost.toLowerCase())),
  DB_SSL_REJECT_UNAUTHORIZED: asBoolean(
    process.env.DB_SSL_REJECT_UNAUTHORIZED,
    Boolean(dbSslCa)
  ),
  DB_SSL_CA: dbSslCa,
};

export default config;
