import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class InterviewExperiences extends Model<InferAttributes<InterviewExperiences>, InferCreationAttributes<InterviewExperiences>> {
    declare id: CreationOptional<string>;
    declare author_member_id: string;
    declare global_company_id: string;
    declare company_name_snapshot: string;
    declare role_title: string;
    declare interview_year: number;
    declare difficulty: number;
    declare outcome: string;
    declare summary: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

InterviewExperiences.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    author_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_company_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    company_name_snapshot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    role_title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    interview_year: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    difficulty: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    outcome: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    summary: {
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
    tableName: "interview_experiences",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
