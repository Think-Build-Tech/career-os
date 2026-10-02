import { BaseService } from "../../../core/base.service";
import { MentorshipFeedback } from "../model/mentorship_feedback.model";
import { MentorshipFeedbackRepository } from "../repository/mentorship-feedback.repository";

export class MentorshipFeedbackService extends BaseService<MentorshipFeedback> {
    constructor() {
        super(new MentorshipFeedbackRepository());
    }
}
