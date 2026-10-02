import { BaseRepository } from "../../../core/base.repository";
import { ReferralOpportunities } from "../model/referral_opportunities.model";

export class ReferralOpportunitiesRepository extends BaseRepository<ReferralOpportunities> {
    constructor() {
        super(ReferralOpportunities);
    }
}
