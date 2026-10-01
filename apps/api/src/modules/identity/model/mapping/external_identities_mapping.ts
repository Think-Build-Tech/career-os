import { ExternalIdentity } from "../account/external_identities.model";
import { IdAccount } from "../account/id_accounts.model";

IdAccount.hasMany(ExternalIdentity, {
    foreignKey: "account_id",
    as: "external_identities",
});

ExternalIdentity.belongsTo(IdAccount, {
    foreignKey: "account_id",
    as: "account",
});
