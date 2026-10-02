import { createResourceHandlers } from "../../../core/controller.utils";
import { InterviewQuestions } from "../model/interview_questions.model";
import { InterviewQuestionsService } from "../service/interview-questions.service";

const service = new InterviewQuestionsService();
const handlers = createResourceHandlers<InterviewQuestions>(service);

export const createInterviewQuestions = handlers.create;
export const getInterviewQuestionss = handlers.getAll;
export const getInterviewQuestionsById = handlers.getById;
export const updateInterviewQuestions = handlers.update;
export const deleteInterviewQuestions = handlers.delete;
