import { TenantBranding } from "../../model/tenant/tenant_brading.model";
import type { TenantBrandingCreatePayload, TenantBrandingUpdatePayload } from "@repo/types";
import { TenantBrandingRepository } from "../../repository/tenant/tenant-branding.repository";
import { BaseService } from "../base.service";

export class TenantBrandingService extends BaseService<TenantBranding, TenantBrandingCreatePayload, TenantBrandingUpdatePayload> {
    constructor() {
        super(new TenantBrandingRepository());
    }
}
