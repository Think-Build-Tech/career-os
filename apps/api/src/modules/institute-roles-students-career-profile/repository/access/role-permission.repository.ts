import { RolePermission } from "../../model/access/role_permissions.model";
import { BaseRepository } from "../base.repository";

export class RolePermissionRepository extends BaseRepository<RolePermission> {
    constructor() {
        super(RolePermission);
    }
}
