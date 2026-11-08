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
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";

export class Notification extends Model<
  InferAttributes<Notification>,
  InferCreationAttributes<Notification>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<string>;
  declare notification_type: string;
  declare title: string;
  declare body: string;
  declare data: CreationOptional<Record<string, unknown>>;
  declare read_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class NotificationDelivery extends Model<
  InferAttributes<NotificationDelivery>,
  InferCreationAttributes<NotificationDelivery>
> {
  declare id: CreationOptional<string>;
  declare notification_id: ForeignKey<Notification["id"]>;
  declare channel: string;
  declare status: CreationOptional<string>;
  declare provider: CreationOptional<string | null>;
  declare provider_reference: CreationOptional<string | null>;
  declare attempts: CreationOptional<number>;
  declare error_details: CreationOptional<Record<string, unknown> | null>;
  declare sent_at: CreationOptional<Date | null>;
  declare delivered_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class NotificationPreference extends Model<
  InferAttributes<NotificationPreference>,
  InferCreationAttributes<NotificationPreference>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<string>;
  declare channel: string;
  declare category: string;
  declare is_enabled: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Notification.init(
  {
    id: idAttribute,
    user_id: requiredUuid("users", "CASCADE"),
    notification_type: { type: DataTypes.STRING(64), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    data: jsonObjectAttribute,
    read_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "notifications", "Notification", {
    indexes: [{ fields: ["user_id", "read_at", "created_at"] }, { fields: ["notification_type"] }],
  })
);

NotificationDelivery.init(
  {
    id: idAttribute,
    notification_id: requiredUuid("notifications", "CASCADE"),
    channel: { type: DataTypes.STRING(32), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    provider: { type: DataTypes.STRING(64), allowNull: true },
    provider_reference: { type: DataTypes.STRING, allowNull: true },
    attempts: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    error_details: { type: DataTypes.JSONB, allowNull: true },
    sent_at: { type: DataTypes.DATE, allowNull: true },
    delivered_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "notification_deliveries", "NotificationDelivery", {
    indexes: [
      { unique: true, fields: ["notification_id", "channel"] },
      { fields: ["status", "created_at"] },
    ],
  })
);

Notification.hasMany(NotificationDelivery, { foreignKey: "notification_id", as: "deliveries" });
NotificationDelivery.belongsTo(Notification, { foreignKey: "notification_id", as: "notification" });

NotificationPreference.init(
  {
    id: idAttribute,
    user_id: requiredUuid("users", "CASCADE"),
    channel: { type: DataTypes.STRING(32), allowNull: false },
    category: { type: DataTypes.STRING(64), allowNull: false },
    is_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "notification_preferences", "NotificationPreference", {
    indexes: [
      { unique: true, fields: ["user_id", "channel", "category"] },
      { fields: ["user_id"] },
    ],
  })
);

export default { Notification, NotificationDelivery, NotificationPreference };
