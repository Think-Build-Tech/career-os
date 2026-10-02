import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Interviews extends Model<InferAttributes<Interviews>, InferCreationAttributes<Interviews>> {
    declare id: CreationOptional<string>;
    declare application_id: string;
    declare recruitment_round_id: string;
    declare scheduled_start: Date;
    declare scheduled_end: Date;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Interviews.init({
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
        allowNull: true,
    },
    scheduled_start: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    scheduled_end: {
        type: DataTypes.DATE,
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
    tableName: "interviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
