import { BaseRepository } from "../../../core/base.repository";
import { EligibilityRuleSets } from "../model/eligibility_rule_sets.model";

export class EligibilityRuleSetsRepository extends BaseRepository<EligibilityRuleSets> {
    constructor() {
        super(EligibilityRuleSets);
    }
}
