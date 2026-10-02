import { Router } from "express";
import { FeaturesController } from "../controller/catalog/features.controller";
import { SubscriptionPlansController } from "../controller/catalog/subscription-plans.controller";
import { createCrudRouter } from "./crud.routes";

const router: Router = Router();

router.use("/features", createCrudRouter(new FeaturesController()));
router.use("/subscription-plans", createCrudRouter(new SubscriptionPlansController()));

export default router;
