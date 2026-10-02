import { createResourceHandlers } from "../../../core/controller.utils";
import { EligibilityRuleSets } from "../model/eligibility_rule_sets.model";
import { EligibilityRuleSetsService } from "../service/eligibility-rule-sets.service";

const service = new EligibilityRuleSetsService();
const handlers = createResourceHandlers<EligibilityRuleSets>(service);

export const createEligibilityRuleSets = handlers.create;
export const getEligibilityRuleSetss = handlers.getAll;
export const getEligibilityRuleSetsById = handlers.getById;
export const updateEligibilityRuleSets = handlers.update;
export const deleteEligibilityRuleSets = handlers.delete;
