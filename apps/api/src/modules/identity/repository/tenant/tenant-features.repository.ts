import { TenantFeatures } from "../../model/tenant/tenant_features.model";
import { BaseRepository } from "../base.repository";

export class TenantFeaturesRepository extends BaseRepository<TenantFeatures> {
    constructor() {
        super(TenantFeatures);
    }
}
