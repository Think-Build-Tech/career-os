import { createResourceHandlers } from "../../../core/controller.utils";
import { ResumeVersions } from "../model/resume_versions.model";
import { ResumeVersionsService } from "../service/resume-versions.service";

const service = new ResumeVersionsService();
const handlers = createResourceHandlers<ResumeVersions>(service);

export const createResumeVersions = handlers.create;
export const getResumeVersionss = handlers.getAll;
export const getResumeVersionsById = handlers.getById;
export const updateResumeVersions = handlers.update;
export const deleteResumeVersions = handlers.delete;
