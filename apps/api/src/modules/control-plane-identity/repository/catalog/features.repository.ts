import { FeaturesBase } from "../../model/catalog/features.model";
import { BaseRepository } from "../base.repository";

export class FeaturesRepository extends BaseRepository<FeaturesBase> {
    constructor() {
        super(FeaturesBase);
    }
}
