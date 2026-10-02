import { BaseRepository } from "../../../core/base.repository";
import { LearningResources } from "../model/learning_resources.model";

export class LearningResourcesRepository extends BaseRepository<LearningResources> {
    constructor() {
        super(LearningResources);
    }
}
