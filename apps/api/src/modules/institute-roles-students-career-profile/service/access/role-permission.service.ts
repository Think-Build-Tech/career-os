import { RolePermission } from "../../model/access/role_permissions.model";
import { RolePermissionRepository } from "../../repository/access/role-permission.repository";
import { BaseService } from "../base.service";

export class RolePermissionService extends BaseService<RolePermission> {
    constructor() {
        super(new RolePermissionRepository());
    }
}
