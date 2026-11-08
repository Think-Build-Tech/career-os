import { Router } from "express";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getAllPermissions,
  createPermission,
  deletePermission,
  assignPermissionToRole,
  removePermissionFromRole,
  getAllRoleAssignments,
  assignRoleToUser,
  updateRoleAssignment,
} from "./identity.controller";

export const identityRouter = Router();

// Roles
identityRouter.get("/roles", getAllRoles);
identityRouter.post("/roles", createRole);
identityRouter.get("/roles/:id", getRoleById);
identityRouter.put("/roles/:id", updateRole);
identityRouter.delete("/roles/:id", deleteRole);

// Permissions
identityRouter.get("/permissions", getAllPermissions);
identityRouter.post("/permissions", createPermission);
identityRouter.delete("/permissions/:id", deletePermission);

// Role Permissions
identityRouter.post("/role-permissions", assignPermissionToRole);
identityRouter.delete("/role-permissions/:id", removePermissionFromRole);

// Role Assignments
identityRouter.get("/assignments", getAllRoleAssignments);
identityRouter.post("/assignments", assignRoleToUser);
identityRouter.put("/assignments/:id", updateRoleAssignment);

