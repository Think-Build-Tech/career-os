import { createResourceHandlers } from "../../../core/controller.utils";
import { AssessmentAttempts } from "../model/assessment_attempts.model";
import { AssessmentAttemptsService } from "../service/assessment-attempts.service";

const service = new AssessmentAttemptsService();
const handlers = createResourceHandlers<AssessmentAttempts>(service);

export const createAssessmentAttempts = handlers.create;
export const getAssessmentAttemptss = handlers.getAll;
export const getAssessmentAttemptsById = handlers.getById;
export const updateAssessmentAttempts = handlers.update;
export const deleteAssessmentAttempts = handlers.delete;
