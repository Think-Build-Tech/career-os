import { AccountTenantMembership } from "../../model/membership/account_tenant_membership.model";
import { BaseRepository } from "../base.repository";

export class AccountTenantMembershipRepository extends BaseRepository<AccountTenantMembership> {
    constructor() {
        super(AccountTenantMembership);
    }
}
