import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ApplicationRoundProgress extends Model<InferAttributes<ApplicationRoundProgress>, InferCreationAttributes<ApplicationRoundProgress>> {
    declare id: CreationOptional<string>;
    declare application_id: string;
    declare recruitment_round_id: string;
    declare status: string;
    declare score: number;
    declare result: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ApplicationRoundProgress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    application_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    recruitment_round_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    score: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    result: {
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
    tableName: "application_round_progress",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
