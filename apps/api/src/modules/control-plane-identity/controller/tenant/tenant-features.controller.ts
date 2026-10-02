import { TenantFeatures } from "../../model/tenant/tenant_features.model";
import type { TenantFeaturesCreatePayload, TenantFeaturesUpdatePayload } from "@repo/types";
import { TenantFeaturesService } from "../../service/tenant/tenant-features.service";
import { BaseController } from "../base.controller";

export class TenantFeaturesController extends BaseController<TenantFeatures, TenantFeaturesCreatePayload, TenantFeaturesUpdatePayload> {
    constructor() {
        super(new TenantFeaturesService());
    }
}
