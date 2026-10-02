import { BaseService } from "../../../core/base.service";
import { ReferralRequests } from "../model/referral_requests.model";
import { ReferralRequestsRepository } from "../repository/referral-requests.repository";

export class ReferralRequestsService extends BaseService<ReferralRequests> {
    constructor() {
        super(new ReferralRequestsRepository());
    }
}
