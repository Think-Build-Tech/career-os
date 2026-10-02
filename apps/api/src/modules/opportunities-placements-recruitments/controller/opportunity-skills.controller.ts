import { createResourceHandlers } from "../../../core/controller.utils";
import { OpportunitySkills } from "../model/opportunity_skills.model";
import { OpportunitySkillsService } from "../service/opportunity-skills.service";

const service = new OpportunitySkillsService();
const handlers = createResourceHandlers<OpportunitySkills>(service);

export const createOpportunitySkills = handlers.create;
export const getOpportunitySkillss = handlers.getAll;
export const getOpportunitySkillsById = handlers.getById;
export const updateOpportunitySkills = handlers.update;
export const deleteOpportunitySkills = handlers.delete;
