import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
} from "sequelize";
import { sequelize } from "../../../config/database";
import {
  createdAtAttribute,
  idAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
} from "../../models/model.helpers";
import type { StudentProfile } from "../../student/models/student.model";
import { User } from "../../user/user.model";

export class DataAccessAudit extends Model<
  InferAttributes<DataAccessAudit>,
  InferCreationAttributes<DataAccessAudit>
> {
  declare id: CreationOptional<string>;
  declare resource_owner_id: ForeignKey<StudentProfile["id"]>;
  declare actor_user_id: ForeignKey<User["id"]>;
  declare organization_id: CreationOptional<string | null>;
  declare resource_type: string;
  declare resource_id: string;
  declare resource_version: CreationOptional<string | null>;
  declare access_type: string;
  declare authorization_basis: string;
  declare purpose: CreationOptional<string | null>;
  declare ip_address: CreationOptional<string | null>;
  declare user_agent: CreationOptional<string | null>;
  declare accessed_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;

  declare resource_owner?: NonAttribute<StudentProfile>;
  declare actor?: NonAttribute<User>;
}

DataAccessAudit.init(
  {
    id: idAttribute,
    resource_owner_id: requiredUuid("student_profiles", "CASCADE"),
    actor_user_id: requiredUuid("users", "CASCADE"),
    organization_id: optionalUuid(),
    resource_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    resource_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    resource_version: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    access_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "VIEW",
    },
    authorization_basis: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ip_address: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    user_agent: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accessed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "data_access_audits", "DataAccessAudit", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["resource_owner_id"] },
      { fields: ["actor_user_id"] },
      { fields: ["resource_type", "resource_id"] },
      { fields: ["accessed_at"] },
    ],
  })
);

export default DataAccessAudit;
