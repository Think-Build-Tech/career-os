import { BaseRepository } from "../../../core/base.repository";
import { MentorSkills } from "../model/mentor_skills.model";

export class MentorSkillsRepository extends BaseRepository<MentorSkills> {
    constructor() {
        super(MentorSkills);
    }
}
