import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class CodingSubmissions extends Model<InferAttributes<CodingSubmissions>, InferCreationAttributes<CodingSubmissions>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare problem_id: string;
    declare language: string;
    declare status: string;
    declare runtime_ms: number;
    declare memory_kb: number;
    declare score: number;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CodingSubmissions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    problem_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    language: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    runtime_ms: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    memory_kb: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    score: {
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
    tableName: "coding_submissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
