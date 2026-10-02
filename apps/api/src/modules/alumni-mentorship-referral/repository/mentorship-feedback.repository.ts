import { BaseRepository } from "../../../core/base.repository";
import { MentorshipFeedback } from "../model/mentorship_feedback.model";

export class MentorshipFeedbackRepository extends BaseRepository<MentorshipFeedback> {
    constructor() {
        super(MentorshipFeedback);
    }
}
