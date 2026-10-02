import { Permission } from "../../model/access/permissions.model";
import { PermissionRepository } from "../../repository/access/permission.repository";
import { BaseService } from "../base.service";

export class PermissionService extends BaseService<Permission> {
    constructor() {
        super(new PermissionRepository());
    }
}
