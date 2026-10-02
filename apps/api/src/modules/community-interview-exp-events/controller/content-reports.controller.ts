import { createResourceHandlers } from "../../../core/controller.utils";
import { ContentReports } from "../model/content_reports.model";
import { ContentReportsService } from "../service/content-reports.service";

const service = new ContentReportsService();
const handlers = createResourceHandlers<ContentReports>(service);

export const createContentReports = handlers.create;
export const getContentReportss = handlers.getAll;
export const getContentReportsById = handlers.getById;
export const updateContentReports = handlers.update;
export const deleteContentReports = handlers.delete;
