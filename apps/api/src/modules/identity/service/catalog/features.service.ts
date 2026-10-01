import { FeaturesBase } from "../../model/catalog/features.model";
import type { FeaturesCreatePayload, FeaturesUpdatePayload } from "@repo/types";
import { FeaturesRepository } from "../../repository/catalog/features.repository";
import { BaseService } from "../base.service";

export class FeaturesService extends BaseService<FeaturesBase, FeaturesCreatePayload, FeaturesUpdatePayload> {
    constructor() {
        super(new FeaturesRepository());
    }
}
