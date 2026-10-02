import { MemberSkill } from "../../model/member/member_skills.model";
import { BaseRepository } from "../base.repository";

export class MemberSkillRepository extends BaseRepository<MemberSkill> {
    constructor() {
        super(MemberSkill);
    }
}
