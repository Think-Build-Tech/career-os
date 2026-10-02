import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorshipGoals } from "../model/mentorship_goals.model";
import { MentorshipGoalsService } from "../service/mentorship-goals.service";

const service = new MentorshipGoalsService();
const handlers = createResourceHandlers<MentorshipGoals>(service);

export const createMentorshipGoals = handlers.create;
export const getMentorshipGoalss = handlers.getAll;
export const getMentorshipGoalsById = handlers.getById;
export const updateMentorshipGoals = handlers.update;
export const deleteMentorshipGoals = handlers.delete;
