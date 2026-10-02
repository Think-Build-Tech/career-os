import { MemberRole } from "../../model/access/member_roles.model";
import { BaseRepository } from "../base.repository";

export class MemberRoleRepository extends BaseRepository<MemberRole> {
    constructor() {
        super(MemberRole);
    }
}
