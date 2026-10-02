import { FeaturesBase } from "../../model/catalog/features.model";
import type { FeaturesCreatePayload, FeaturesUpdatePayload } from "@repo/types";
import { FeaturesService } from "../../service/catalog/features.service";
import { BaseController } from "../base.controller";

export class FeaturesController extends BaseController<FeaturesBase, FeaturesCreatePayload, FeaturesUpdatePayload> {
    constructor() {
        super(new FeaturesService());
    }
}
