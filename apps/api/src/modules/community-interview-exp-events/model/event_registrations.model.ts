import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EventRegistrations extends Model<InferAttributes<EventRegistrations>, InferCreationAttributes<EventRegistrations>> {
    declare id: CreationOptional<string>;
    declare event_id: string;
    declare member_id: string;
    declare status: string;
    declare attended: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EventRegistrations.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    event_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    attended: {
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
    tableName: "event_registrations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
