import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorshipSessions extends Model<InferAttributes<MentorshipSessions>, InferCreationAttributes<MentorshipSessions>> {
    declare id: CreationOptional<string>;
    declare mentorship_id: string;
    declare scheduled_start: Date;
    declare scheduled_end: Date;
    declare meeting_url: string;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorshipSessions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    mentorship_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    scheduled_start: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    scheduled_end: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    meeting_url: {
        type: DataTypes.STRING,
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
    tableName: "mentorship_sessions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
