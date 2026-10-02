import { TenantDatabaseRegistry } from "../../model/tenant/tenant_database_registry.model";
import { BaseRepository } from "../base.repository";

export class TenantDatabaseRegistryRepository extends BaseRepository<TenantDatabaseRegistry> {
    constructor() {
        super(TenantDatabaseRegistry);
    }
}
