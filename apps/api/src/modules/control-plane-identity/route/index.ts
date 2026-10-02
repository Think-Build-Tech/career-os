import { Router } from "express";
import accountRoutes from "./account.routes";
import catalogRoutes from "./catalog.routes";
import membershipRoutes from "./membership.routes";
import tenantRoutes from "./tenant.routes";

const identityRoutes: Router = Router();

identityRoutes.use(accountRoutes);
identityRoutes.use(tenantRoutes);
identityRoutes.use(catalogRoutes);
identityRoutes.use(membershipRoutes);

export default identityRoutes;
