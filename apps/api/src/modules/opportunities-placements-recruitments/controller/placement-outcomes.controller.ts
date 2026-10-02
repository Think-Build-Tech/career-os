import { createResourceHandlers } from "../../../core/controller.utils";
import { PlacementOutcomes } from "../model/placement_outcomes.model";
import { PlacementOutcomesService } from "../service/placement-outcomes.service";

const service = new PlacementOutcomesService();
const handlers = createResourceHandlers<PlacementOutcomes>(service);

export const createPlacementOutcomes = handlers.create;
export const getPlacementOutcomess = handlers.getAll;
export const getPlacementOutcomesById = handlers.getById;
export const updatePlacementOutcomes = handlers.update;
export const deletePlacementOutcomes = handlers.delete;
