import { Permission } from "../access/permissions.model";
import { Role } from "../access/roles.model";
import { MemberRole } from "../access/member_roles.model";
import { RolePermission } from "../access/role_permissions.model";

Role.hasMany(MemberRole, {
    foreignKey: "role_id",
    as: "member_roles",
});

MemberRole.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
});

Role.hasMany(RolePermission, {
    foreignKey: "role_id",
    as: "role_permissions",
});

RolePermission.belongsTo(Role, {
    foreignKey: "role_id",
    as: "role",
});

Permission.hasMany(RolePermission, {
    foreignKey: "permission_id",
    as: "role_permissions",
});

RolePermission.belongsTo(Permission, {
    foreignKey: "permission_id",
    as: "permission",
});
