import { createResourceHandlers } from "../../../core/controller.utils";
import { EligibilityRuleGroups } from "../model/eligibility_rule_groups.model";
import { EligibilityRuleGroupsService } from "../service/eligibility-rule-groups.service";

const service = new EligibilityRuleGroupsService();
const handlers = createResourceHandlers<EligibilityRuleGroups>(service);

export const createEligibilityRuleGroups = handlers.create;
export const getEligibilityRuleGroupss = handlers.getAll;
export const getEligibilityRuleGroupsById = handlers.getById;
export const updateEligibilityRuleGroups = handlers.update;
export const deleteEligibilityRuleGroups = handlers.delete;
