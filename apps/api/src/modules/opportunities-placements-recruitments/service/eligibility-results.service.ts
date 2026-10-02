import { BaseService } from "../../../core/base.service";
import { EligibilityResults } from "../model/eligibility_results.model";
import { EligibilityResultsRepository } from "../repository/eligibility-results.repository";

export class EligibilityResultsService extends BaseService<EligibilityResults> {
    constructor() {
        super(new EligibilityResultsRepository());
    }
}
