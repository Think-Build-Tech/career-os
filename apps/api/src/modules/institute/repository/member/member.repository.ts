import { Member } from "../../model/member/members.model";
import { BaseRepository } from "../base.repository";

export class MemberRepository extends BaseRepository<Member> {
    constructor() {
        super(Member);
    }
}
