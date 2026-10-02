import { BaseRepository } from "../../../core/base.repository";
import { ReferralRequests } from "../model/referral_requests.model";

export class ReferralRequestsRepository extends BaseRepository<ReferralRequests> {
    constructor() {
        super(ReferralRequests);
    }
}
