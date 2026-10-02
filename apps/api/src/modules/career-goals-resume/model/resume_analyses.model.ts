import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ResumeAnalyses extends Model<InferAttributes<ResumeAnalyses>, InferCreationAttributes<ResumeAnalyses>> {
    declare id: CreationOptional<string>;
    declare resume_version_id: string;
    declare opportunity_id: string;
    declare ats_score: number;
    declare keyword_score: number;
    declare overall_score: number;
    declare analysis: any;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ResumeAnalyses.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    resume_version_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    ats_score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    keyword_score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    overall_score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    analysis: {
        type: DataTypes.JSON,
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
    tableName: "resume_analyses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
