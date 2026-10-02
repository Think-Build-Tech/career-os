import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorshipRequests extends Model<InferAttributes<MentorshipRequests>, InferCreationAttributes<MentorshipRequests>> {
    declare id: CreationOptional<string>;
    declare student_member_id: string;
    declare mentor_member_id: string;
    declare message: string;
    declare status: string;
    declare requested_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorshipRequests.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    student_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    mentor_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    requested_at: {
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
    tableName: "mentorship_requests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
