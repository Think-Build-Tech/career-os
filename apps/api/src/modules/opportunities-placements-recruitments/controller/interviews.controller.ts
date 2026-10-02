import { createResourceHandlers } from "../../../core/controller.utils";
import { Interviews } from "../model/interviews.model";
import { InterviewsService } from "../service/interviews.service";

const service = new InterviewsService();
const handlers = createResourceHandlers<Interviews>(service);

export const createInterviews = handlers.create;
export const getInterviewss = handlers.getAll;
export const getInterviewsById = handlers.getById;
export const updateInterviews = handlers.update;
export const deleteInterviews = handlers.delete;
