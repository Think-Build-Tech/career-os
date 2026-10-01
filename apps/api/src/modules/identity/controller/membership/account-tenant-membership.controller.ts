import { AccountTenantMembership } from "../../model/membership/account_tenant_membership.model";
import type { AccountTenantMembershipCreatePayload, AccountTenantMembershipUpdatePayload } from "@repo/types";
import { AccountTenantMembershipService } from "../../service/membership/account-tenant-membership.service";
import { BaseController } from "../base.controller";

export class AccountTenantMembershipController extends BaseController<AccountTenantMembership, AccountTenantMembershipCreatePayload, AccountTenantMembershipUpdatePayload> {
    constructor() {
        super(new AccountTenantMembershipService());
    }
}
