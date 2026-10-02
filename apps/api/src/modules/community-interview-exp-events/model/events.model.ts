import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Events extends Model<InferAttributes<Events>, InferCreationAttributes<Events>> {
    declare id: CreationOptional<string>;
    declare organizer_member_id: string;
    declare title: string;
    declare event_type: string;
    declare start_at: Date;
    declare end_at: Date;
    declare meeting_url: string;
    declare capacity: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Events.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    organizer_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    event_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    start_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    meeting_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    status: {
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
    tableName: "events",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
