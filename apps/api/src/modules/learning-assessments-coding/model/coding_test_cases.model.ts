import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class CodingTestCases extends Model<InferAttributes<CodingTestCases>, InferCreationAttributes<CodingTestCases>> {
    declare id: CreationOptional<string>;
    declare problem_id: string;
    declare input_data: string;
    declare expected_output: string;
    declare is_hidden: boolean;
    declare weight: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CodingTestCases.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    problem_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    input_data: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    expected_output: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    weight: {
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
    tableName: "coding_test_cases",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
