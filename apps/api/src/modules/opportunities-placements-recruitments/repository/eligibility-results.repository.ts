import { BaseRepository } from "../../../core/base.repository";
import { EligibilityResults } from "../model/eligibility_results.model";

export class EligibilityResultsRepository extends BaseRepository<EligibilityResults> {
    constructor() {
        super(EligibilityResults);
    }
}
