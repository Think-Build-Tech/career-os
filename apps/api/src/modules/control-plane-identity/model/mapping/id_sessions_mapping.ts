import { IdAccount } from "../account/id_accounts.model";
import { IdSession } from "../account/id_sessions.model";
import { Tenant } from "../tenant/tenants.model";

IdAccount.hasMany(IdSession, {
    foreignKey: "account_id",
    as: "sessions",
});

IdSession.belongsTo(IdAccount, {
    foreignKey: "account_id",
    as: "account",
});

Tenant.hasMany(IdSession, {
    foreignKey: "current_tenant_id",
    as: "sessions",
});

IdSession.belongsTo(Tenant, {
    foreignKey: "current_tenant_id",
    as: "current_tenant",
});
