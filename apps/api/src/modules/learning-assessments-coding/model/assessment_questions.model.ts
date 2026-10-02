import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AssessmentQuestions extends Model<InferAttributes<AssessmentQuestions>, InferCreationAttributes<AssessmentQuestions>> {
    declare id: CreationOptional<string>;
    declare assessment_id: string;
    declare question_type: string;
    declare question_text: string;
    declare marks: number;
    declare sequence_no: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AssessmentQuestions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    question_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    question_text: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    marks: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    sequence_no: {
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
    tableName: "assessment_questions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
