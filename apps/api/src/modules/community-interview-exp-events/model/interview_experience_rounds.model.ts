import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class InterviewExperienceRounds extends Model<InferAttributes<InterviewExperienceRounds>, InferCreationAttributes<InterviewExperienceRounds>> {
    declare id: CreationOptional<string>;
    declare interview_experience_id: string;
    declare sequence_no: number;
    declare round_name: string;
    declare round_type: string;
    declare difficulty: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

InterviewExperienceRounds.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    interview_experience_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    sequence_no: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    round_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    round_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    difficulty: {
        type: DataTypes.INTEGER,
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
    tableName: "interview_experience_rounds",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
