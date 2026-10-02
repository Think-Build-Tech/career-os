import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class MentorshipFeedback extends Model<InferAttributes<MentorshipFeedback>, InferCreationAttributes<MentorshipFeedback>> {
    declare id: CreationOptional<string>;
    declare session_id: string;
    declare submitted_by_member_id: string;
    declare rating: number;
    declare feedback: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

MentorshipFeedback.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    session_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    submitted_by_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    feedback: {
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
    tableName: "mentorship_feedback",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
