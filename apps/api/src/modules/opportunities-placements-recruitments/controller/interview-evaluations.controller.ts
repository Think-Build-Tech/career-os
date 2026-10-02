import { createResourceHandlers } from "../../../core/controller.utils";
import { InterviewEvaluations } from "../model/interview_evaluations.model";
import { InterviewEvaluationsService } from "../service/interview-evaluations.service";

const service = new InterviewEvaluationsService();
const handlers = createResourceHandlers<InterviewEvaluations>(service);

export const createInterviewEvaluations = handlers.create;
export const getInterviewEvaluationss = handlers.getAll;
export const getInterviewEvaluationsById = handlers.getById;
export const updateInterviewEvaluations = handlers.update;
export const deleteInterviewEvaluations = handlers.delete;
