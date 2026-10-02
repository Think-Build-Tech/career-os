import { createResourceHandlers } from "../../../core/controller.utils";
import { ApplicationStatusHistory } from "../model/application_status_history.model";
import { ApplicationStatusHistoryService } from "../service/application-status-history.service";

const service = new ApplicationStatusHistoryService();
const handlers = createResourceHandlers<ApplicationStatusHistory>(service);

export const createApplicationStatusHistory = handlers.create;
export const getApplicationStatusHistorys = handlers.getAll;
export const getApplicationStatusHistoryById = handlers.getById;
export const updateApplicationStatusHistory = handlers.update;
export const deleteApplicationStatusHistory = handlers.delete;
