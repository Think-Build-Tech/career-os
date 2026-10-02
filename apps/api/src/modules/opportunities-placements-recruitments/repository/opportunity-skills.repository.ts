import { BaseRepository } from "../../../core/base.repository";
import { OpportunitySkills } from "../model/opportunity_skills.model";

export class OpportunitySkillsRepository extends BaseRepository<OpportunitySkills> {
    constructor() {
        super(OpportunitySkills);
    }
}
