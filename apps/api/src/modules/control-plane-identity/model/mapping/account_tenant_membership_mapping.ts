import { AccountTenantMembership } from "../membership/account_tenant_membership.model";
import { IdAccount } from "../account/id_accounts.model";
import { Tenant } from "../tenant/tenants.model";

IdAccount.hasMany(AccountTenantMembership, {
    foreignKey: "account_id",
    as: "memberships",
});

AccountTenantMembership.belongsTo(IdAccount, {
    foreignKey: "account_id",
    as: "account",
});

Tenant.hasMany(AccountTenantMembership, {
    foreignKey: "tenant_id",
    as: "memberships",
});

AccountTenantMembership.belongsTo(Tenant, {
    foreignKey: "tenant_id",
    as: "tenant",
});
