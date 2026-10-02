import { createResourceHandlers } from "../../../core/controller.utils";
import { ReferralRequests } from "../model/referral_requests.model";
import { ReferralRequestsService } from "../service/referral-requests.service";

const service = new ReferralRequestsService();
const handlers = createResourceHandlers<ReferralRequests>(service);

export const createReferralRequests = handlers.create;
export const getReferralRequestss = handlers.getAll;
export const getReferralRequestsById = handlers.getById;
export const updateReferralRequests = handlers.update;
export const deleteReferralRequests = handlers.delete;
