import { createResourceHandlers } from "../../../core/controller.utils";
import { PlacementDriveOpportunities } from "../model/placement_drive_opportunities.model";
import { PlacementDriveOpportunitiesService } from "../service/placement-drive-opportunities.service";

const service = new PlacementDriveOpportunitiesService();
const handlers = createResourceHandlers<PlacementDriveOpportunities>(service);

export const createPlacementDriveOpportunities = handlers.create;
export const getPlacementDriveOpportunitiess = handlers.getAll;
export const getPlacementDriveOpportunitiesById = handlers.getById;
export const updatePlacementDriveOpportunities = handlers.update;
export const deletePlacementDriveOpportunities = handlers.delete;
