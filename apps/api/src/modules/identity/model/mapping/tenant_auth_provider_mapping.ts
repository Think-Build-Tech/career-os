import { Tenant } from "../tenant/tenants.model";
import { TenantAuthProvider } from "../tenant/tenant_auth_provider.model";

Tenant.hasMany(TenantAuthProvider, {
    foreignKey: "tenant_id",
    as: "auth_providers",
});

TenantAuthProvider.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
