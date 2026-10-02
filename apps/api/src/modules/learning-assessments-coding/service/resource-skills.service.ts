import { BaseService } from "../../../core/base.service";
import { ResourceSkills } from "../model/resource_skills.model";
import { ResourceSkillsRepository } from "../repository/resource-skills.repository";

export class ResourceSkillsService extends BaseService<ResourceSkills> {
    constructor() {
        super(new ResourceSkillsRepository());
    }
}
