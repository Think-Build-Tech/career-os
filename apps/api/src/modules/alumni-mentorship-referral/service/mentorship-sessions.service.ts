import { BaseService } from "../../../core/base.service";
import { MentorshipSessions } from "../model/mentorship_sessions.model";
import { MentorshipSessionsRepository } from "../repository/mentorship-sessions.repository";

export class MentorshipSessionsService extends BaseService<MentorshipSessions> {
    constructor() {
        super(new MentorshipSessionsRepository());
    }
}
