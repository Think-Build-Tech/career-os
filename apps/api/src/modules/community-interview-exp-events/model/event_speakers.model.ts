import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EventSpeakers extends Model<InferAttributes<EventSpeakers>, InferCreationAttributes<EventSpeakers>> {
    declare id: CreationOptional<string>;
    declare event_id: string;
    declare member_id: string;
    declare external_name: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EventSpeakers.init({
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
        allowNull: true,
    },
    external_name: {
        type: DataTypes.STRING,
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
    tableName: "event_speakers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
