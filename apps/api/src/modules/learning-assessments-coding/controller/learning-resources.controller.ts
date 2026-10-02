import { createResourceHandlers } from "../../../core/controller.utils";
import { LearningResources } from "../model/learning_resources.model";
import { LearningResourcesService } from "../service/learning-resources.service";

const service = new LearningResourcesService();
const handlers = createResourceHandlers<LearningResources>(service);

export const createLearningResources = handlers.create;
export const getLearningResourcess = handlers.getAll;
export const getLearningResourcesById = handlers.getById;
export const updateLearningResources = handlers.update;
export const deleteLearningResources = handlers.delete;
