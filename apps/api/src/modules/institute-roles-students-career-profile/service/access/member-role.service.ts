import { MemberRole } from "../../model/access/member_roles.model";
import { MemberRoleRepository } from "../../repository/access/member-role.repository";
import { BaseService } from "../base.service";

export class MemberRoleService extends BaseService<MemberRole> {
    constructor() {
        super(new MemberRoleRepository());
    }
}
