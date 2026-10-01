import bodyParser from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import {Request, Response} from "express";
import identityRoutes from "./modules/identity/route";
import "./modules/identity";

const { json, urlencoded } = bodyParser;

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/api/identity", identityRoutes)
    .get("/message/:name", (req: Request, res: Response) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_: any, res: Response) => {
      return res.json({ ok: true });
    });

  return app;
};
