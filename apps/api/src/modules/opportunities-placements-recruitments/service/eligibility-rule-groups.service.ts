import { BaseService } from "../../../core/base.service";
import { EligibilityRuleGroups } from "../model/eligibility_rule_groups.model";
import { EligibilityRuleGroupsRepository } from "../repository/eligibility-rule-groups.repository";

export class EligibilityRuleGroupsService extends BaseService<EligibilityRuleGroups> {
    constructor() {
        super(new EligibilityRuleGroupsRepository());
    }
}
