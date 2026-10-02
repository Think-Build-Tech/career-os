import { MemberProfile } from "../../model/member/member_profiles.model";
import { MemberProfileRepository } from "../../repository/member/member-profile.repository";
import { BaseService } from "../base.service";

export class MemberProfileService extends BaseService<MemberProfile> {
    constructor() {
        super(new MemberProfileRepository());
    }
}
