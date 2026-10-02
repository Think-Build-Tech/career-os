import { createResourceHandlers } from "../../../core/controller.utils";
import { ResumeAnalyses } from "../model/resume_analyses.model";
import { ResumeAnalysesService } from "../service/resume-analyses.service";

const service = new ResumeAnalysesService();
const handlers = createResourceHandlers<ResumeAnalyses>(service);

export const createResumeAnalyses = handlers.create;
export const getResumeAnalysess = handlers.getAll;
export const getResumeAnalysesById = handlers.getById;
export const updateResumeAnalyses = handlers.update;
export const deleteResumeAnalyses = handlers.delete;
