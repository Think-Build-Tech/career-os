import { Router } from "express";
import { ExternalIdentityController } from "../controller/account/external-identity.controller";
import { IdAccountController } from "../controller/account/id-account.controller";
import { IdSessionController } from "../controller/account/id-session.controller";
import { createCrudRouter } from "./crud.routes";

const router: Router = Router();

router.use("/accounts", createCrudRouter(new IdAccountController()));
router.use("/external-identities", createCrudRouter(new ExternalIdentityController()));
router.use("/sessions", createCrudRouter(new IdSessionController()));

export default router;
