import { TenantFeatures } from "../../model/tenant/tenant_features.model";
import type { TenantFeaturesCreatePayload, TenantFeaturesUpdatePayload } from "@repo/types";
import { TenantFeaturesRepository } from "../../repository/tenant/tenant-features.repository";
import { BaseService } from "../base.service";

export class TenantFeaturesService extends BaseService<TenantFeatures, TenantFeaturesCreatePayload, TenantFeaturesUpdatePayload> {
    constructor() {
        super(new TenantFeaturesRepository());
    }
}
