import { Permission } from "../../model/access/permissions.model";
import { BaseRepository } from "../base.repository";

export class PermissionRepository extends BaseRepository<Permission> {
    constructor() {
        super(Permission);
    }
}
