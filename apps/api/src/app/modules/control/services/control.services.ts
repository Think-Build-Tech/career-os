import { CrudService, MutableService } from "../../services";
import {
  GlobalUser,
  PlatformAdmin,
  Subscription,
  Tenant,
  TenantDatabase,
  TenantMembership,
  TenantProvisioningJob,
} from "../models";

// Call initializeControlModels(controlSequelize) before invoking these services.
export class TenantService extends CrudService<Tenant> {
  constructor() { super(Tenant); }
}
export class GlobalUserService extends CrudService<GlobalUser> {
  constructor() { super(GlobalUser); }
}
export class TenantMembershipService extends CrudService<TenantMembership> {
  constructor() { super(TenantMembership); }
}
export class TenantDatabaseService extends MutableService<TenantDatabase> {
  constructor() { super(TenantDatabase); }
}
export class TenantProvisioningJobService extends MutableService<TenantProvisioningJob> {
  constructor() { super(TenantProvisioningJob); }
}
export class SubscriptionService extends CrudService<Subscription> {
  constructor() { super(Subscription); }
}
export class PlatformAdminService extends CrudService<PlatformAdmin> {
  constructor() { super(PlatformAdmin); }
}
