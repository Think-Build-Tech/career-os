import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class NotificationPreferences extends Model<InferAttributes<NotificationPreferences>, InferCreationAttributes<NotificationPreferences>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare category: string;
    declare in_app_enabled: boolean;
    declare email_enabled: boolean;
    declare push_enabled: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

NotificationPreferences.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    in_app_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    email_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    push_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: "notification_preferences",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
