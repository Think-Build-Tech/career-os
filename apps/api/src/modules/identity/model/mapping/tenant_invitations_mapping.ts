import { Tenant } from "../tenant/tenants.model";
import { TenantInvitation } from "../tenant/tenant_invitations.model";

Tenant.hasMany(TenantInvitation, {
    foreignKey: "tenant_id",
    as: "invitations",
});

TenantInvitation.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
