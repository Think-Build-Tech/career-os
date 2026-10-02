import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorshipRequests } from "../model/mentorship_requests.model";
import { MentorshipRequestsService } from "../service/mentorship-requests.service";

const service = new MentorshipRequestsService();
const handlers = createResourceHandlers<MentorshipRequests>(service);

export const createMentorshipRequests = handlers.create;
export const getMentorshipRequestss = handlers.getAll;
export const getMentorshipRequestsById = handlers.getById;
export const updateMentorshipRequests = handlers.update;
export const deleteMentorshipRequests = handlers.delete;
