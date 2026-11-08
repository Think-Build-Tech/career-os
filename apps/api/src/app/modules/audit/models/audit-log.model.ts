import {
  CreationOptional,
  DataTypes,
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
} from "../../models/model.helpers";

export class AuditLog extends Model<
  InferAttributes<AuditLog>,
  InferCreationAttributes<AuditLog>
> {
  declare id: CreationOptional<string>;
  declare actor_user_id: CreationOptional<string | null>;
  declare action: string;
  declare entity_type: string;
  declare entity_id: string;
  declare previous_value: CreationOptional<Record<string, unknown> | null>;
  declare new_value: CreationOptional<Record<string, unknown> | null>;
  declare ip_address: CreationOptional<string | null>;
  declare user_agent: CreationOptional<string | null>;
  declare correlation_id: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
}

AuditLog.init(
  {
    id: idAttribute,
    actor_user_id: optionalUuid("users"),
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity_type: { type: DataTypes.STRING(100), allowNull: false },
    entity_id: { type: DataTypes.UUID, allowNull: false },
    previous_value: { type: DataTypes.JSONB, allowNull: true },
    new_value: { type: DataTypes.JSONB, allowNull: true },
    ip_address: { type: DataTypes.INET, allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    correlation_id: { type: DataTypes.UUID, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "audit_logs", "AuditLog", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["entity_type", "entity_id"] },
      { fields: ["actor_user_id"] },
      { fields: ["created_at"] },
      { fields: ["correlation_id"] },
    ],
  })
);

export default AuditLog;
