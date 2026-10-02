import { createResourceHandlers } from "../../../core/controller.utils";
import { RoadmapItems } from "../model/roadmap_items.model";
import { RoadmapItemsService } from "../service/roadmap-items.service";

const service = new RoadmapItemsService();
const handlers = createResourceHandlers<RoadmapItems>(service);

export const createRoadmapItems = handlers.create;
export const getRoadmapItemss = handlers.getAll;
export const getRoadmapItemsById = handlers.getById;
export const updateRoadmapItems = handlers.update;
export const deleteRoadmapItems = handlers.delete;
