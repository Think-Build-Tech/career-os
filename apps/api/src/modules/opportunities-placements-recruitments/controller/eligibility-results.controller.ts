import { createResourceHandlers } from "../../../core/controller.utils";
import { EligibilityResults } from "../model/eligibility_results.model";
import { EligibilityResultsService } from "../service/eligibility-results.service";

const service = new EligibilityResultsService();
const handlers = createResourceHandlers<EligibilityResults>(service);

export const createEligibilityResults = handlers.create;
export const getEligibilityResultss = handlers.getAll;
export const getEligibilityResultsById = handlers.getById;
export const updateEligibilityResults = handlers.update;
export const deleteEligibilityResults = handlers.delete;
