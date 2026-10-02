import { BaseRepository } from "../../../core/base.repository";
import { MentorshipSessions } from "../model/mentorship_sessions.model";

export class MentorshipSessionsRepository extends BaseRepository<MentorshipSessions> {
    constructor() {
        super(MentorshipSessions);
    }
}
