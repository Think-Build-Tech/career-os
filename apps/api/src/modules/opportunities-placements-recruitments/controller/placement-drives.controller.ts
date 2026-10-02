import { createResourceHandlers } from "../../../core/controller.utils";
import { PlacementDrives } from "../model/placement_drives.model";
import { PlacementDrivesService } from "../service/placement-drives.service";

const service = new PlacementDrivesService();
const handlers = createResourceHandlers<PlacementDrives>(service);

export const createPlacementDrives = handlers.create;
export const getPlacementDrivess = handlers.getAll;
export const getPlacementDrivesById = handlers.getById;
export const updatePlacementDrives = handlers.update;
export const deletePlacementDrives = handlers.delete;
