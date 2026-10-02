import { BaseRepository } from "../../../core/base.repository";
import { EligibilityRules } from "../model/eligibility_rules.model";

export class EligibilityRulesRepository extends BaseRepository<EligibilityRules> {
    constructor() {
        super(EligibilityRules);
    }
}
