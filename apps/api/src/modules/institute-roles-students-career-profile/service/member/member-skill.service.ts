import { MemberSkill } from "../../model/member/member_skills.model";
import { MemberSkillRepository } from "../../repository/member/member-skill.repository";
import { BaseService } from "../base.service";

export class MemberSkillService extends BaseService<MemberSkill> {
    constructor() {
        super(new MemberSkillRepository());
    }
}
