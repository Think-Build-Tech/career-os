import { createResourceHandlers } from "../../../core/controller.utils";
import { Applications } from "../model/applications.model";
import { ApplicationsService } from "../service/applications.service";

const service = new ApplicationsService();
const handlers = createResourceHandlers<Applications>(service);

export const createApplications = handlers.create;
export const getApplicationss = handlers.getAll;
export const getApplicationsById = handlers.getById;
export const updateApplications = handlers.update;
export const deleteApplications = handlers.delete;
