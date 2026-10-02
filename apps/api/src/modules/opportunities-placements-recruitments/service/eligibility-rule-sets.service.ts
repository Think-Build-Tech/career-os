import { BaseService } from "../../../core/base.service";
import { EligibilityRuleSets } from "../model/eligibility_rule_sets.model";
import { EligibilityRuleSetsRepository } from "../repository/eligibility-rule-sets.repository";

export class EligibilityRuleSetsService extends BaseService<EligibilityRuleSets> {
    constructor() {
        super(new EligibilityRuleSetsRepository());
    }
}
