import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Assessments extends Model<InferAttributes<Assessments>, InferCreationAttributes<Assessments>> {
    declare id: CreationOptional<string>;
    declare title: string;
    declare assessment_type: string;
    declare duration_minutes: number;
    declare total_marks: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Assessments.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    assessment_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    total_marks: {
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
    tableName: "assessments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
