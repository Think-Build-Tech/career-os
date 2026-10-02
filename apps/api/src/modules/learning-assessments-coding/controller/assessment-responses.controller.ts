import { createResourceHandlers } from "../../../core/controller.utils";
import { AssessmentResponses } from "../model/assessment_responses.model";
import { AssessmentResponsesService } from "../service/assessment-responses.service";

const service = new AssessmentResponsesService();
const handlers = createResourceHandlers<AssessmentResponses>(service);

export const createAssessmentResponses = handlers.create;
export const getAssessmentResponsess = handlers.getAll;
export const getAssessmentResponsesById = handlers.getById;
export const updateAssessmentResponses = handlers.update;
export const deleteAssessmentResponses = handlers.delete;
