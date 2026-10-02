import { TenantBranding } from "../../model/tenant/tenant_brading.model";
import type { TenantBrandingCreatePayload, TenantBrandingUpdatePayload } from "@repo/types";
import { TenantBrandingService } from "../../service/tenant/tenant-branding.service";
import { BaseController } from "../base.controller";

export class TenantBrandingController extends BaseController<TenantBranding, TenantBrandingCreatePayload, TenantBrandingUpdatePayload> {
    constructor() {
        super(new TenantBrandingService());
    }
}
