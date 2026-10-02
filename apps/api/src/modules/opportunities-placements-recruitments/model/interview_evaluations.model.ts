import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class InterviewEvaluations extends Model<InferAttributes<InterviewEvaluations>, InferCreationAttributes<InterviewEvaluations>> {
    declare id: CreationOptional<string>;
    declare interview_id: string;
    declare evaluator_member_id: string;
    declare overall_score: number;
    declare recommendation: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

InterviewEvaluations.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    interview_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    evaluator_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    overall_score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    recommendation: {
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
    tableName: "interview_evaluations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
