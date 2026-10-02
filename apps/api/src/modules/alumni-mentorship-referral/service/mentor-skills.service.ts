import { BaseService } from "../../../core/base.service";
import { MentorSkills } from "../model/mentor_skills.model";
import { MentorSkillsRepository } from "../repository/mentor-skills.repository";

export class MentorSkillsService extends BaseService<MentorSkills> {
    constructor() {
        super(new MentorSkillsRepository());
    }
}
