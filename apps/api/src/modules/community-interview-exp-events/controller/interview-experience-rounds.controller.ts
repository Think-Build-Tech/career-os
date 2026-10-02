import { createResourceHandlers } from "../../../core/controller.utils";
import { InterviewExperienceRounds } from "../model/interview_experience_rounds.model";
import { InterviewExperienceRoundsService } from "../service/interview-experience-rounds.service";

const service = new InterviewExperienceRoundsService();
const handlers = createResourceHandlers<InterviewExperienceRounds>(service);

export const createInterviewExperienceRounds = handlers.create;
export const getInterviewExperienceRoundss = handlers.getAll;
export const getInterviewExperienceRoundsById = handlers.getById;
export const updateInterviewExperienceRounds = handlers.update;
export const deleteInterviewExperienceRounds = handlers.delete;
