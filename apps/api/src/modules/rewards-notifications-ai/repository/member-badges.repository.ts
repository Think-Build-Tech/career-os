import { BaseRepository } from "../../../core/base.repository";
import { MemberBadges } from "../model/member_badges.model";

export class MemberBadgesRepository extends BaseRepository<MemberBadges> {
    constructor() {
        super(MemberBadges);
    }
}
