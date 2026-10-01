import { Router } from "express";
import { AccountTenantMembershipController } from "../controller/membership/account-tenant-membership.controller";
import { TenantSubscriptionsController } from "../controller/membership/tenant-subscriptions.controller";
import { createCrudRouter } from "./crud.routes";

const router: Router = Router();

router.use("/account-tenant-memberships", createCrudRouter(new AccountTenantMembershipController()));
router.use("/tenant-subscriptions", createCrudRouter(new TenantSubscriptionsController()));

export default router;
