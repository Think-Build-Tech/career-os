import { BaseRepository } from "../../../core/base.repository";
import { MentorshipRequests } from "../model/mentorship_requests.model";

export class MentorshipRequestsRepository extends BaseRepository<MentorshipRequests> {
    constructor() {
        super(MentorshipRequests);
    }
}
