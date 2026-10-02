import { BaseRepository } from "../../../core/base.repository";
import { EligibilityRuleGroups } from "../model/eligibility_rule_groups.model";

export class EligibilityRuleGroupsRepository extends BaseRepository<EligibilityRuleGroups> {
    constructor() {
        super(EligibilityRuleGroups);
    }
}
