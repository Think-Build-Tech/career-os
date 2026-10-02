import { createResourceHandlers } from "../../../core/controller.utils";
import { EligibilityRules } from "../model/eligibility_rules.model";
import { EligibilityRulesService } from "../service/eligibility-rules.service";

const service = new EligibilityRulesService();
const handlers = createResourceHandlers<EligibilityRules>(service);

export const createEligibilityRules = handlers.create;
export const getEligibilityRuless = handlers.getAll;
export const getEligibilityRulesById = handlers.getById;
export const updateEligibilityRules = handlers.update;
export const deleteEligibilityRules = handlers.delete;
