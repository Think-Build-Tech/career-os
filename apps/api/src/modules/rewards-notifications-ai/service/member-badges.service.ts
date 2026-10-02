import { BaseService } from "../../../core/base.service";
import { MemberBadges } from "../model/member_badges.model";
import { MemberBadgesRepository } from "../repository/member-badges.repository";

export class MemberBadgesService extends BaseService<MemberBadges> {
    constructor() {
        super(new MemberBadgesRepository());
    }
}
