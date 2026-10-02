import { createResourceHandlers } from "../../../core/controller.utils";
import { MentorshipFeedback } from "../model/mentorship_feedback.model";
import { MentorshipFeedbackService } from "../service/mentorship-feedback.service";

const service = new MentorshipFeedbackService();
const handlers = createResourceHandlers<MentorshipFeedback>(service);

export const createMentorshipFeedback = handlers.create;
export const getMentorshipFeedbacks = handlers.getAll;
export const getMentorshipFeedbackById = handlers.getById;
export const updateMentorshipFeedback = handlers.update;
export const deleteMentorshipFeedback = handlers.delete;
