import { createResourceHandlers } from "../../../core/controller.utils";
import { OpportunitySubmissionReviews } from "../model/opportunity_submission_reviews.model";
import { OpportunitySubmissionReviewsService } from "../service/opportunity-submission-reviews.service";

const service = new OpportunitySubmissionReviewsService();
const handlers = createResourceHandlers<OpportunitySubmissionReviews>(service);

export const createOpportunitySubmissionReviews = handlers.create;
export const getOpportunitySubmissionReviewss = handlers.getAll;
export const getOpportunitySubmissionReviewsById = handlers.getById;
export const updateOpportunitySubmissionReviews = handlers.update;
export const deleteOpportunitySubmissionReviews = handlers.delete;
