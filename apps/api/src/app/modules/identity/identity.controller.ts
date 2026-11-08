import { Request, Response } from "express";
import {
  RoleService,
  PermissionService,
  RolePermissionService,
  RoleAssignmentService,
} from "./services";

const roleService = new RoleService();
const permissionService = new PermissionService();
const rolePermissionService = new RolePermissionService();
const roleAssignmentService = new RoleAssignmentService();

// Roles
export async function getAllRoles(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const roles = await roleService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      roles,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getRoleById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide role ID",
      });
    }

    const role = await roleService.findById(id);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Role not found",
      });
    }

    return res.status(200).json({
      success: true,
      role,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createRole(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.name || !data.code) {
      return res.status(400).json({
        success: false,
        message: "name and code are required",
      });
    }

    const role = await roleService.create(data);
    return res.status(201).json({
      success: true,
      role,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateRole(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide role ID",
      });
    }

    const role = await roleService.updateById(id, data);
    return res.status(200).json({
      success: true,
      role,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deleteRole(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide role ID",
      });
    }

    await roleService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Permissions
export async function getAllPermissions(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 50;
    const permissions = await permissionService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      permissions,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createPermission(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.resource || !data.action) {
      return res.status(400).json({
        success: false,
        message: "resource and action are required",
      });
    }

    const permission = await permissionService.create(data);
    return res.status(201).json({
      success: true,
      permission,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function deletePermission(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide permission ID",
      });
    }

    await permissionService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Permission deleted successfully",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Role Permissions
export async function assignPermissionToRole(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.role_id || !data.permission_id) {
      return res.status(400).json({
        success: false,
        message: "role_id and permission_id are required",
      });
    }

    const rolePermission = await rolePermissionService.create(data);
    return res.status(201).json({
      success: true,
      rolePermission,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function removePermissionFromRole(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide role-permission ID",
      });
    }

    await rolePermissionService.deleteById(id);
    return res.status(200).json({
      success: true,
      message: "Permission removed from role",
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Role Assignments
export async function getAllRoleAssignments(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const assignments = await roleAssignmentService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      assignments,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function assignRoleToUser(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.user_id || !data.role_id || !data.scope_type) {
      return res.status(400).json({
        success: false,
        message: "user_id, role_id, and scope_type are required",
      });
    }

    const assignment = await roleAssignmentService.create(data);
    return res.status(201).json({
      success: true,
      assignment,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateRoleAssignment(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide role assignment ID",
      });
    }

    const assignment = await roleAssignmentService.updateById(id, data);
    return res.status(200).json({
      success: true,
      assignment,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

