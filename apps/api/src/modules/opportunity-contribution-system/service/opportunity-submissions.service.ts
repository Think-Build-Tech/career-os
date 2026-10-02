import { BaseService } from "../../../core/base.service";
import { OpportunitySubmissions } from "../model/opportunity_submissions.model";
import { OpportunitySubmissionsRepository } from "../repository/opportunity-submissions.repository";

export class OpportunitySubmissionsService extends BaseService<OpportunitySubmissions> {
    constructor() {
        super(new OpportunitySubmissionsRepository());
    }
}
