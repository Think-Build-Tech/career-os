import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorshipRelationships } from "../model/mentorship_relationships.model";
import { MentorshipRelationshipsService } from "../service/mentorship-relationships.service";

const service = new MentorshipRelationshipsService();
const handlers = createResourceHandlers<MentorshipRelationships>(service);

export const createMentorshipRelationships = handlers.create;
export const getMentorshipRelationshipss = handlers.getAll;
export const getMentorshipRelationshipsById = handlers.getById;
export const updateMentorshipRelationships = handlers.update;
export const deleteMentorshipRelationships = handlers.delete;
