import { MemberProfile } from "../../model/member/member_profiles.model";
import { BaseRepository } from "../base.repository";

export class MemberProfileRepository extends BaseRepository<MemberProfile> {
    constructor() {
        super(MemberProfile);
    }
}
