import { BaseService } from "../../../core/base.service";
import { OpportunitySkills } from "../model/opportunity_skills.model";
import { OpportunitySkillsRepository } from "../repository/opportunity-skills.repository";

export class OpportunitySkillsService extends BaseService<OpportunitySkills> {
    constructor() {
        super(new OpportunitySkillsRepository());
    }
}
