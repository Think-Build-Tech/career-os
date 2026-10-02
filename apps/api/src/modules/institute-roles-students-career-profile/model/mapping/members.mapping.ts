import { IdAccount } from "../../../control-plane-identity/model/account/id_accounts.model";
import { Member } from "../member/members.model";

IdAccount.hasMany(Member, {
    foreignKey: "account_id",
    as: "memberships",
});

Member.belongsTo(IdAccount, {
    foreignKey: "account_id",
    as: "account",
});
