import { Router } from "express";
import {
    createRole,
    getRoles,
    getRoleById,
    updateRole,
    deleteRole,
} from "../controller/access/role.controller";
import {
    createPermission,
    getPermissions,
    getPermissionById,
    updatePermission,
    deletePermission,
} from "../controller/access/permission.controller";
import {
    createRolePermission,
    getRolePermissions,
    getRolePermissionById,
    updateRolePermission,
    deleteRolePermission,
} from "../controller/access/role-permission.controller";
import {
    createMemberRole,
    getMemberRoles,
    getMemberRoleById,
    updateMemberRole,
    deleteMemberRole,
} from "../controller/access/member-role.controller";

const router: Router = Router();

// Roles
router.route("/roles").get(getRoles).post(createRole);
router.route("/roles/:id").get(getRoleById).patch(updateRole).delete(deleteRole);

// Permissions
router.route("/permissions").get(getPermissions).post(createPermission);
router.route("/permissions/:id").get(getPermissionById).patch(updatePermission).delete(deletePermission);

// Role Permissions
router.route("/role-permissions").get(getRolePermissions).post(createRolePermission);
router.route("/role-permissions/:id").get(getRolePermissionById).patch(updateRolePermission).delete(deleteRolePermission);

// Member Roles
router.route("/member-roles").get(getMemberRoles).post(createMemberRole);
router.route("/member-roles/:id").get(getMemberRoleById).patch(updateMemberRole).delete(deleteMemberRole);

export default router;
