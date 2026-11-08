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
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { Message } from "../../chat/models/chat.models";

export class MessageModeration extends Model<
  InferAttributes<MessageModeration>,
  InferCreationAttributes<MessageModeration>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare status: string;
  declare risk_level: string;
  declare categories: CreationOptional<string[]>;
  declare scores: CreationOptional<Record<string, unknown>>;
  declare recommended_action: CreationOptional<string>;
  declare model_name: CreationOptional<string | null>;
  declare model_version: CreationOptional<string | null>;
  declare moderated_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
}

export class MessageReport extends Model<
  InferAttributes<MessageReport>,
  InferCreationAttributes<MessageReport>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare reporter_user_id: ForeignKey<string>;
  declare category: string;
  declare details: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ModerationCase extends Model<
  InferAttributes<ModerationCase>,
  InferCreationAttributes<ModerationCase>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare message_moderation_id: CreationOptional<ForeignKey<MessageModeration["id"]> | null>;
  declare message_report_id: CreationOptional<ForeignKey<MessageReport["id"]> | null>;
  declare status: CreationOptional<string>;
  declare severity: string;
  declare assigned_to: CreationOptional<string | null>;
  declare resolution: CreationOptional<string | null>;
  declare opened_at: CreationOptional<Date>;
  declare closed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ModerationAction extends Model<
  InferAttributes<ModerationAction>,
  InferCreationAttributes<ModerationAction>
> {
  declare id: CreationOptional<string>;
  declare moderation_case_id: ForeignKey<ModerationCase["id"]>;
  declare action_type: string;
  declare actor_user_id: CreationOptional<string | null>;
  declare target_user_id: CreationOptional<string | null>;
  declare reason: CreationOptional<string | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

MessageModeration.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    status: { type: DataTypes.STRING(32), allowNull: false },
    risk_level: { type: DataTypes.STRING(16), allowNull: false },
    categories: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
    scores: jsonObjectAttribute,
    recommended_action: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "NONE" },
    model_name: { type: DataTypes.STRING(120), allowNull: true },
    model_version: { type: DataTypes.STRING(120), allowNull: true },
    moderated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "message_moderations", "MessageModeration", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["message_id"] }, { fields: ["status", "risk_level"] }],
  })
);

MessageReport.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    reporter_user_id: requiredUuid("users", "CASCADE"),
    category: { type: DataTypes.STRING(64), allowNull: false },
    details: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "OPEN" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "message_reports", "MessageReport", {
    indexes: [
      { unique: true, fields: ["message_id", "reporter_user_id"] },
      { fields: ["status"] },
    ],
  })
);

ModerationCase.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    message_moderation_id: optionalUuid("message_moderations"),
    message_report_id: optionalUuid("message_reports"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "OPEN" },
    severity: { type: DataTypes.STRING(16), allowNull: false },
    assigned_to: optionalUuid("users"),
    resolution: { type: DataTypes.TEXT, allowNull: true },
    opened_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    closed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "moderation_cases", "ModerationCase", {
    indexes: [{ fields: ["status", "severity"] }, { fields: ["message_id"] }],
  })
);

ModerationAction.init(
  {
    id: idAttribute,
    moderation_case_id: requiredUuid("moderation_cases", "CASCADE"),
    action_type: { type: DataTypes.STRING(32), allowNull: false },
    actor_user_id: optionalUuid("users"),
    target_user_id: optionalUuid("users"),
    reason: { type: DataTypes.TEXT, allowNull: true },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "moderation_actions", "ModerationAction", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["moderation_case_id", "created_at"] }],
  })
);

MessageModeration.hasMany(ModerationCase, { foreignKey: "message_moderation_id", as: "cases" });
MessageReport.hasMany(ModerationCase, { foreignKey: "message_report_id", as: "cases" });
ModerationCase.hasMany(ModerationAction, { foreignKey: "moderation_case_id", as: "actions" });
ModerationAction.belongsTo(ModerationCase, { foreignKey: "moderation_case_id", as: "moderation_case" });

export default { MessageModeration, MessageReport, ModerationCase, ModerationAction };
