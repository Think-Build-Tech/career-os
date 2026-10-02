import { BaseRepository } from "../../../core/base.repository";
import { OpportunitySubmissions } from "../model/opportunity_submissions.model";

export class OpportunitySubmissionsRepository extends BaseRepository<OpportunitySubmissions> {
    constructor() {
        super(OpportunitySubmissions);
    }
}
