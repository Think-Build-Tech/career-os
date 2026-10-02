import { BaseService } from "../../../core/base.service";
import { OpportunitySubmissionMessages } from "../model/opportunity_submission_messages.model";
import { OpportunitySubmissionMessagesRepository } from "../repository/opportunity-submission-messages.repository";

export class OpportunitySubmissionMessagesService extends BaseService<OpportunitySubmissionMessages> {
    constructor() {
        super(new OpportunitySubmissionMessagesRepository());
    }
}
