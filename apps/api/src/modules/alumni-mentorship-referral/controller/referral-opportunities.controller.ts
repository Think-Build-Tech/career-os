import { createResourceHandlers } from "../../../core/controller.utils";
import { ReferralOpportunities } from "../model/referral_opportunities.model";
import { ReferralOpportunitiesService } from "../service/referral-opportunities.service";

const service = new ReferralOpportunitiesService();
const handlers = createResourceHandlers<ReferralOpportunities>(service);

export const createReferralOpportunities = handlers.create;
export const getReferralOpportunitiess = handlers.getAll;
export const getReferralOpportunitiesById = handlers.getById;
export const updateReferralOpportunities = handlers.update;
export const deleteReferralOpportunities = handlers.delete;
