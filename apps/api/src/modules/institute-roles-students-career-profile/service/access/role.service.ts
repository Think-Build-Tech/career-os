import { Role } from "../../model/access/roles.model";
import { RoleRepository } from "../../repository/access/role.repository";
import { BaseService } from "../base.service";

export class RoleService extends BaseService<Role> {
    constructor() {
        super(new RoleRepository());
    }
}
