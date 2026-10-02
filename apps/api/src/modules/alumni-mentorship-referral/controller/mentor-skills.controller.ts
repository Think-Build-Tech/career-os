import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorSkills } from "../model/mentor_skills.model";
import { MentorSkillsService } from "../service/mentor-skills.service";

const service = new MentorSkillsService();
const handlers = createResourceHandlers<MentorSkills>(service);

export const createMentorSkills = handlers.create;
export const getMentorSkillss = handlers.getAll;
export const getMentorSkillsById = handlers.getById;
export const updateMentorSkills = handlers.update;
export const deleteMentorSkills = handlers.delete;
