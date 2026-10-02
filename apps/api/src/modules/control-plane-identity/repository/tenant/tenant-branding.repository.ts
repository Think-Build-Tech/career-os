import { TenantBranding } from "../../model/tenant/tenant_brading.model";
import { BaseRepository } from "../base.repository";

export class TenantBrandingRepository extends BaseRepository<TenantBranding> {
    constructor() {
        super(TenantBranding);
    }
}
