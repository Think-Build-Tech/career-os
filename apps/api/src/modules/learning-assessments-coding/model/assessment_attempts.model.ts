import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class AssessmentAttempts extends Model<InferAttributes<AssessmentAttempts>, InferCreationAttributes<AssessmentAttempts>> {
    declare id: CreationOptional<string>;
    declare assessment_id: string;
    declare member_id: string;
    declare started_at: Date;
    declare submitted_at: Date;
    declare score: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

AssessmentAttempts.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    score: {
        type: DataTypes.DECIMAL(10, 2),
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
    tableName: "assessment_attempts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
