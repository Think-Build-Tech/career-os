import { Router } from "express";
import { TenantAuthProviderController } from "../controller/tenant/tenant-auth-provider.controller";
import { TenantBrandingController } from "../controller/tenant/tenant-branding.controller";
import { TenantDatabaseRegistryController } from "../controller/tenant/tenant-database-registry.controller";
import { TenantDeploymentsController } from "../controller/tenant/tenant-deployments.controller";
import { TenantDomainsController } from "../controller/tenant/tenant-domains.controller";
import { TenantFeaturesController } from "../controller/tenant/tenant-features.controller";
import { TenantInvitationController } from "../controller/tenant/tenant-invitations.controller";
import { TenantController } from "../controller/tenant/tenant.controller";
import { createCrudRouter } from "./crud.routes";

const router: Router = Router();
const tenantController = new TenantController();
const tenantRoutes: Router = Router();

tenantRoutes.get("/by-name", tenantController.getByName.bind(tenantController));
tenantRoutes.use(createCrudRouter(tenantController));

router.use("/tenants", tenantRoutes);
router.use("/tenant-auth-providers", createCrudRouter(new TenantAuthProviderController()));
router.use("/tenant-branding", createCrudRouter(new TenantBrandingController()));
router.use("/tenant-database-registries", createCrudRouter(new TenantDatabaseRegistryController()));
router.use("/tenant-deployments", createCrudRouter(new TenantDeploymentsController()));
router.use("/tenant-domains", createCrudRouter(new TenantDomainsController()));
router.use("/tenant-features", createCrudRouter(new TenantFeaturesController()));
router.use("/tenant-invitations", createCrudRouter(new TenantInvitationController()));

export default router;
