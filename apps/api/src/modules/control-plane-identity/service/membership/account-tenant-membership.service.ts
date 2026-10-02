import { AccountTenantMembership } from "../../model/membership/account_tenant_membership.model";
import type { AccountTenantMembershipCreatePayload, AccountTenantMembershipUpdatePayload } from "@repo/types";
import { AccountTenantMembershipRepository } from "../../repository/membership/account-tenant-membership.repository";
import { BaseService } from "../base.service";

export class AccountTenantMembershipService extends BaseService<AccountTenantMembership, AccountTenantMembershipCreatePayload, AccountTenantMembershipUpdatePayload> {
    constructor() {
        super(new AccountTenantMembershipRepository());
    }
}
