import { BaseService } from "../../../core/base.service";
import { LearningResources } from "../model/learning_resources.model";
import { LearningResourcesRepository } from "../repository/learning-resources.repository";

export class LearningResourcesService extends BaseService<LearningResources> {
    constructor() {
        super(new LearningResourcesRepository());
    }
}
