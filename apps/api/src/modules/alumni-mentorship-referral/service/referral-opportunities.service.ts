import { BaseService } from "../../../core/base.service";
import { ReferralOpportunities } from "../model/referral_opportunities.model";
import { ReferralOpportunitiesRepository } from "../repository/referral-opportunities.repository";

export class ReferralOpportunitiesService extends BaseService<ReferralOpportunities> {
    constructor() {
        super(new ReferralOpportunitiesRepository());
    }
}
