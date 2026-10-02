import { createResourceHandlers } from "../../../core/controller.utils";
import { ResourceProgress } from "../model/resource_progress.model";
import { ResourceProgressService } from "../service/resource-progress.service";

const service = new ResourceProgressService();
const handlers = createResourceHandlers<ResourceProgress>(service);

export const createResourceProgress = handlers.create;
export const getResourceProgresss = handlers.getAll;
export const getResourceProgressById = handlers.getById;
export const updateResourceProgress = handlers.update;
export const deleteResourceProgress = handlers.delete;
