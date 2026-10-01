import { Tenant } from "../tenant/tenants.model";
import { TenantBranding } from "../tenant/tenant_brading.model";

Tenant.hasOne(TenantBranding, {
    foreignKey: "tenant_id",
    as: "branding",
});

TenantBranding.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
