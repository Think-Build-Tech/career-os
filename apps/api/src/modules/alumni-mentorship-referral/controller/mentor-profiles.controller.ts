import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorProfiles } from "../model/mentor_profiles.model";
import { MentorProfilesService } from "../service/mentor-profiles.service";

const service = new MentorProfilesService();
const handlers = createResourceHandlers<MentorProfiles>(service);

export const createMentorProfiles = handlers.create;
export const getMentorProfiless = handlers.getAll;
export const getMentorProfilesById = handlers.getById;
export const updateMentorProfiles = handlers.update;
export const deleteMentorProfiles = handlers.delete;
