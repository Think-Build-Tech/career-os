import { createResourceHandlers } from "../../../core/controller.utils";
import { ApplicationRoundProgress } from "../model/application_round_progress.model";
import { ApplicationRoundProgressService } from "../service/application-round-progress.service";

const service = new ApplicationRoundProgressService();
const handlers = createResourceHandlers<ApplicationRoundProgress>(service);

export const createApplicationRoundProgress = handlers.create;
export const getApplicationRoundProgresss = handlers.getAll;
export const getApplicationRoundProgressById = handlers.getById;
export const updateApplicationRoundProgress = handlers.update;
export const deleteApplicationRoundProgress = handlers.delete;
