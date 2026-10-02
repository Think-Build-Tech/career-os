import { createResourceHandlers } from "../../../core/controller.utils";
import { CareerRoadmaps } from "../model/career_roadmaps.model";
import { CareerRoadmapsService } from "../service/career-roadmaps.service";

const service = new CareerRoadmapsService();
const handlers = createResourceHandlers<CareerRoadmaps>(service);

export const createCareerRoadmaps = handlers.create;
export const getCareerRoadmapss = handlers.getAll;
export const getCareerRoadmapsById = handlers.getById;
export const updateCareerRoadmaps = handlers.update;
export const deleteCareerRoadmaps = handlers.delete;
