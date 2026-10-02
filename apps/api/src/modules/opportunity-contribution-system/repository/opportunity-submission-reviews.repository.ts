import { BaseRepository } from "../../../core/base.repository";
import { OpportunitySubmissionReviews } from "../model/opportunity_submission_reviews.model";

export class OpportunitySubmissionReviewsRepository extends BaseRepository<OpportunitySubmissionReviews> {
    constructor() {
        super(OpportunitySubmissionReviews);
    }
}
