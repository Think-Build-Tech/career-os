import { CrudService, MutableService } from "../../services";
import { Permission, Role, RoleAssignment, RolePermission } from "../models";

export class RoleService extends CrudService<Role> {
  constructor() { super(Role); }
}

export class PermissionService extends CrudService<Permission> {
  constructor() { super(Permission); }
}

export class RolePermissionService extends CrudService<RolePermission> {
  constructor() { super(RolePermission); }
}

export class RoleAssignmentService extends MutableService<RoleAssignment> {
  constructor() { super(RoleAssignment); }
}
