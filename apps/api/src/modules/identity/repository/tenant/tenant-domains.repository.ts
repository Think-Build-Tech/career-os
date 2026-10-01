import { TenantDomains } from "../../model/tenant/tenant_domains.model";
import { BaseRepository } from "../base.repository";

export class TenantDomainsRepository extends BaseRepository<TenantDomains> {
    constructor() {
        super(TenantDomains);
    }
}
