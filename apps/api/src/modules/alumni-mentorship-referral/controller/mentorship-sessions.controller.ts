import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorshipSessions } from "../model/mentorship_sessions.model";
import { MentorshipSessionsService } from "../service/mentorship-sessions.service";

const service = new MentorshipSessionsService();
const handlers = createResourceHandlers<MentorshipSessions>(service);

export const createMentorshipSessions = handlers.create;
export const getMentorshipSessionss = handlers.getAll;
export const getMentorshipSessionsById = handlers.getById;
export const updateMentorshipSessions = handlers.update;
export const deleteMentorshipSessions = handlers.delete;
