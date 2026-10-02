import { BaseRepository } from "../../../core/base.repository";
import { OpportunitySubmissionMessages } from "../model/opportunity_submission_messages.model";

export class OpportunitySubmissionMessagesRepository extends BaseRepository<OpportunitySubmissionMessages> {
    constructor() {
        super(OpportunitySubmissionMessages);
    }
}
