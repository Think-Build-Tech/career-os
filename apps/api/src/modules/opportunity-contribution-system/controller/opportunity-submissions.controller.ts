import { createResourceHandlers } from "../../../core/controller.utils";
import { OpportunitySubmissions } from "../model/opportunity_submissions.model";
import { OpportunitySubmissionsService } from "../service/opportunity-submissions.service";

const service = new OpportunitySubmissionsService();
const handlers = createResourceHandlers<OpportunitySubmissions>(service);

export const createOpportunitySubmissions = handlers.create;
export const getOpportunitySubmissionss = handlers.getAll;
export const getOpportunitySubmissionsById = handlers.getById;
export const updateOpportunitySubmissions = handlers.update;
export const deleteOpportunitySubmissions = handlers.delete;
