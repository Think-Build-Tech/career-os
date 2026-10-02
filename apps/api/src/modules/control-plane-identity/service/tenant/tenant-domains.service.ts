import { TenantDomains } from "../../model/tenant/tenant_domains.model";
import type { TenantDomainsCreatePayload, TenantDomainsUpdatePayload } from "@repo/types";
import { TenantDomainsRepository } from "../../repository/tenant/tenant-domains.repository";
import { BaseService } from "../base.service";

export class TenantDomainsService extends BaseService<TenantDomains, TenantDomainsCreatePayload, TenantDomainsUpdatePayload> {
    constructor() {
        super(new TenantDomainsRepository());
    }
}
