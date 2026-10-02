import { createResourceHandlers } from "../../../core/controller.utils";
import { InterviewExperiences } from "../model/interview_experiences.model";
import { InterviewExperiencesService } from "../service/interview-experiences.service";

const service = new InterviewExperiencesService();
const handlers = createResourceHandlers<InterviewExperiences>(service);

export const createInterviewExperiences = handlers.create;
export const getInterviewExperiencess = handlers.getAll;
export const getInterviewExperiencesById = handlers.getById;
export const updateInterviewExperiences = handlers.update;
export const deleteInterviewExperiences = handlers.delete;
