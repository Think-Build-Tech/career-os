import { TenantDatabaseRegistry } from "../../model/tenant/tenant_database_registry.model";
import type { TenantDatabaseRegistryCreatePayload, TenantDatabaseRegistryUpdatePayload } from "@repo/types";
import { TenantDatabaseRegistryService } from "../../service/tenant/tenant-database-registry.service";
import { BaseController } from "../base.controller";

export class TenantDatabaseRegistryController extends BaseController<TenantDatabaseRegistry, TenantDatabaseRegistryCreatePayload, TenantDatabaseRegistryUpdatePayload> {
    constructor() {
        super(new TenantDatabaseRegistryService());
    }
}
