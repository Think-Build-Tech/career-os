import { BaseService } from "../../../core/base.service";
import { EligibilityRules } from "../model/eligibility_rules.model";
import { EligibilityRulesRepository } from "../repository/eligibility-rules.repository";

export class EligibilityRulesService extends BaseService<EligibilityRules> {
    constructor() {
        super(new EligibilityRulesRepository());
    }
}
