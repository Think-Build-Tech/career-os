import { Tenant } from "../tenant/tenants.model";
import { TenantDatabaseRegistry } from "../tenant/tenant_database_registry.model";

Tenant.hasMany(TenantDatabaseRegistry, {
    foreignKey: "tenant_id",
    as: "database_registries",
});

TenantDatabaseRegistry.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
