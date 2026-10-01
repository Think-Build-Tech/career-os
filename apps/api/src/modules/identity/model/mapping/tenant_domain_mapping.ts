import { Tenant } from "../tenant/tenants.model";
import { TenantDomains } from "../tenant/tenant_domains.model";

Tenant.hasMany(TenantDomains, {
    foreignKey: "tenant_id",
    as: "tenant_domains",
});

TenantDomains.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
