import { BaseRepository } from "../../../core/base.repository";
import { ResourceSkills } from "../model/resource_skills.model";

export class ResourceSkillsRepository extends BaseRepository<ResourceSkills> {
    constructor() {
        super(ResourceSkills);
    }
}
