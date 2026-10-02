import { createResourceHandlers } from "../../../core/controller.utils";
import { Assessments } from "../model/assessments.model";
import { AssessmentsService } from "../service/assessments.service";

const service = new AssessmentsService();
const handlers = createResourceHandlers<Assessments>(service);

export const createAssessments = handlers.create;
export const getAssessmentss = handlers.getAll;
export const getAssessmentsById = handlers.getById;
export const updateAssessments = handlers.update;
export const deleteAssessments = handlers.delete;
