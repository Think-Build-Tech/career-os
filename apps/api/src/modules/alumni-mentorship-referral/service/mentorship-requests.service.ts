import { BaseService } from "../../../core/base.service";
import { MentorshipRequests } from "../model/mentorship_requests.model";
import { MentorshipRequestsRepository } from "../repository/mentorship-requests.repository";

export class MentorshipRequestsService extends BaseService<MentorshipRequests> {
    constructor() {
        super(new MentorshipRequestsRepository());
    }
}
