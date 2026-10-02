import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AssessmentResponses extends Model<InferAttributes<AssessmentResponses>, InferCreationAttributes<AssessmentResponses>> {
    declare id: CreationOptional<string>;
    declare attempt_id: string;
    declare question_id: string;
    declare response: any;
    declare awarded_marks: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AssessmentResponses.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    attempt_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    question_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    response: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    awarded_marks: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: "assessment_responses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
