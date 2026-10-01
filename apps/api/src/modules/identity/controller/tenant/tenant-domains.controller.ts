import { TenantDomains } from "../../model/tenant/tenant_domains.model";
import type { TenantDomainsCreatePayload, TenantDomainsUpdatePayload } from "@repo/types";
import { TenantDomainsService } from "../../service/tenant/tenant-domains.service";
import { BaseController } from "../base.controller";

export class TenantDomainsController extends BaseController<TenantDomains, TenantDomainsCreatePayload, TenantDomainsUpdatePayload> {
    constructor() {
        super(new TenantDomainsService());
    }
}
