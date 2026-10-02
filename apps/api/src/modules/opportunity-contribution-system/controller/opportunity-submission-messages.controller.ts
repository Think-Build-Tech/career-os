import { createResourceHandlers } from "../../../core/controller.utils";
import { OpportunitySubmissionMessages } from "../model/opportunity_submission_messages.model";
import { OpportunitySubmissionMessagesService } from "../service/opportunity-submission-messages.service";

const service = new OpportunitySubmissionMessagesService();
const handlers = createResourceHandlers<OpportunitySubmissionMessages>(service);

export const createOpportunitySubmissionMessages = handlers.create;
export const getOpportunitySubmissionMessagess = handlers.getAll;
export const getOpportunitySubmissionMessagesById = handlers.getById;
export const updateOpportunitySubmissionMessages = handlers.update;
export const deleteOpportunitySubmissionMessages = handlers.delete;
