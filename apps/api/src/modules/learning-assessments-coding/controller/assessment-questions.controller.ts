import { createResourceHandlers } from "../../../core/controller.utils";
import { AssessmentQuestions } from "../model/assessment_questions.model";
import { AssessmentQuestionsService } from "../service/assessment-questions.service";

const service = new AssessmentQuestionsService();
const handlers = createResourceHandlers<AssessmentQuestions>(service);

export const createAssessmentQuestions = handlers.create;
export const getAssessmentQuestionss = handlers.getAll;
export const getAssessmentQuestionsById = handlers.getById;
export const updateAssessmentQuestions = handlers.update;
export const deleteAssessmentQuestions = handlers.delete;
