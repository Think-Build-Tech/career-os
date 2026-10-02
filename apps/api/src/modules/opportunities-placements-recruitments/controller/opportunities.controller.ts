import { createResourceHandlers } from "../../../core/controller.utils";
import { Opportunities } from "../model/opportunities.model";
import { OpportunitiesService } from "../service/opportunities.service";

const service = new OpportunitiesService();
const handlers = createResourceHandlers<Opportunities>(service);

export const createOpportunities = handlers.create;
export const getOpportunitiess = handlers.getAll;
export const getOpportunitiesById = handlers.getById;
export const updateOpportunities = handlers.update;
export const deleteOpportunities = handlers.delete;
