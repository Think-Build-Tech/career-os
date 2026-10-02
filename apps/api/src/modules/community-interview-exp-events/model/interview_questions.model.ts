import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class InterviewQuestions extends Model<InferAttributes<InterviewQuestions>, InferCreationAttributes<InterviewQuestions>> {
    declare id: CreationOptional<string>;
    declare round_id: string;
    declare question_text: string;
    declare question_type: string;
    declare topic: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

InterviewQuestions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    round_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    question_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    topic: {
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
    tableName: "interview_questions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
