import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class NotificationDeliveries extends Model<InferAttributes<NotificationDeliveries>, InferCreationAttributes<NotificationDeliveries>> {
    declare id: CreationOptional<string>;
    declare notification_id: string;
    declare channel: string;
    declare delivery_status: string;
    declare delivered_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

NotificationDeliveries.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    notification_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    channel: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    delivery_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    delivered_at: {
        type: DataTypes.DATE,
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
    tableName: "notification_deliveries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
