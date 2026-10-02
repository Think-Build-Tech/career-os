import { Member } from "../../model/member/members.model";
import { MemberRepository } from "../../repository/member/member.repository";
import { BaseService } from "../base.service";

export class MemberService extends BaseService<Member> {
    constructor() {
        super(new MemberRepository());
    }
}
