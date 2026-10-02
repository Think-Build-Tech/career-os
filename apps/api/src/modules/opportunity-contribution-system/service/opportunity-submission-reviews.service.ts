import { BaseService } from "../../../core/base.service";
import { OpportunitySubmissionReviews } from "../model/opportunity_submission_reviews.model";
import { OpportunitySubmissionReviewsRepository } from "../repository/opportunity-submission-reviews.repository";

export class OpportunitySubmissionReviewsService extends BaseService<OpportunitySubmissionReviews> {
    constructor() {
        super(new OpportunitySubmissionReviewsRepository());
    }
}
