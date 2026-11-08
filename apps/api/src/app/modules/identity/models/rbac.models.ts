import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";
import {
  createdAtAttribute,
  idAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { User } from "../../user/user.model";

export class Role extends Model<InferAttributes<Role>, InferCreationAttributes<Role>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare code: string;
  declare description: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class Permission extends Model<
  InferAttributes<Permission>,
  InferCreationAttributes<Permission>
> {
  declare id: CreationOptional<string>;
  declare resource: string;
  declare action: string;
  declare description: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class RolePermission extends Model<
  InferAttributes<RolePermission>,
  InferCreationAttributes<RolePermission>
> {
  declare id: CreationOptional<string>;
  declare role_id: ForeignKey<Role["id"]>;
  declare permission_id: ForeignKey<Permission["id"]>;
  declare created_at: CreationOptional<Date>;
}

export class RoleAssignment extends Model<
  InferAttributes<RoleAssignment>,
  InferCreationAttributes<RoleAssignment>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare role_id: ForeignKey<Role["id"]>;
  declare scope_type: string;
  declare scope_id: CreationOptional<string | null>;
  declare valid_from: CreationOptional<Date>;
  declare valid_until: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Role.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "roles", "Role")
);

Permission.init(
  {
    id: idAttribute,
    resource: { type: DataTypes.STRING(100), allowNull: false },
    action: { type: DataTypes.STRING(64), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "permissions", "Permission", {
    indexes: [{ unique: true, fields: ["resource", "action"] }],
  })
);

RolePermission.init(
  {
    id: idAttribute,
    role_id: requiredUuid("roles", "CASCADE"),
    permission_id: requiredUuid("permissions", "CASCADE"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "role_permissions", "RolePermission", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["role_id", "permission_id"] }],
  })
);

RoleAssignment.init(
  {
    id: idAttribute,
    user_id: requiredUuid("users", "CASCADE"),
    role_id: requiredUuid("roles", "CASCADE"),
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: optionalUuid(),
    valid_from: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    valid_until: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "role_assignments", "RoleAssignment", {
    indexes: [
      { fields: ["user_id"] },
      { fields: ["scope_type", "scope_id"] },
      { fields: ["role_id"] },
    ],
  })
);

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "role_id",
  otherKey: "permission_id",
  as: "permissions",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permission_id",
  otherKey: "role_id",
  as: "roles",
});
Role.hasMany(RoleAssignment, { foreignKey: "role_id", as: "assignments" });

export default { Role, Permission, RolePermission, RoleAssignment };
