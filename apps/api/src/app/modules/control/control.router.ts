import { Router } from "express";
import {
  getAllTenants,
  getTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  getAllSubscriptions,
  createSubscription,
  getAllPlatformAdmins,
  createPlatformAdmin,
  updatePlatformAdmin,
  revokePlatformAdmin,
  getAllProvisioningJobs,
  createProvisioningJob,
  resolveTenant,
  getResolvableColleges,
} from "./control.controller";
import { requirePlatformAdmin } from "../auth/auth.middleware";

export const controlRouter = Router();

// College Tenant Resolution & Database Isolation for Login
controlRouter.get("/colleges", getResolvableColleges);
controlRouter.get("/resolve/:codeOrSlug", resolveTenant);
controlRouter.post("/resolve", resolveTenant);
controlRouter.get("/tenants/resolve/:codeOrSlug", resolveTenant);

controlRouter.use(requirePlatformAdmin);

// Tenants
controlRouter.get("/tenants", getAllTenants);
controlRouter.post("/tenants", createTenant);
controlRouter.get("/tenants/:id", getTenantById);
controlRouter.put("/tenants/:id", updateTenant);
controlRouter.delete("/tenants/:id", deleteTenant);

// Subscriptions
controlRouter.get("/subscriptions", getAllSubscriptions);
controlRouter.post("/subscriptions", createSubscription);

// Platform Admins
controlRouter.get("/admins", getAllPlatformAdmins);
controlRouter.post("/admins", createPlatformAdmin);
controlRouter.put("/admins/:id", updatePlatformAdmin);
controlRouter.delete("/admins/:id", revokePlatformAdmin);

// Provisioning Jobs
controlRouter.get("/jobs", getAllProvisioningJobs);
controlRouter.post("/jobs", createProvisioningJob);

