import { Tenant } from "../tenant/tenants.model";
import { TenantDeployments } from "../tenant/tenant_deployments.model";

Tenant.hasMany(TenantDeployments, {
    foreignKey: "tenant_id",
    as: "deployments",
});

TenantDeployments.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
