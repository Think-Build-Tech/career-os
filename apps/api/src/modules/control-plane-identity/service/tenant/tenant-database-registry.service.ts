import { TenantDatabaseRegistry } from "../../model/tenant/tenant_database_registry.model";
import type { TenantDatabaseRegistryCreatePayload, TenantDatabaseRegistryUpdatePayload } from "@repo/types";
import { TenantDatabaseRegistryRepository } from "../../repository/tenant/tenant-database-registry.repository";
import { BaseService } from "../base.service";

export class TenantDatabaseRegistryService extends BaseService<TenantDatabaseRegistry, TenantDatabaseRegistryCreatePayload, TenantDatabaseRegistryUpdatePayload> {
    constructor() {
        super(new TenantDatabaseRegistryRepository());
    }
}
