import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ResourceProgress extends Model<InferAttributes<ResourceProgress>, InferCreationAttributes<ResourceProgress>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare resource_id: string;
    declare status: string;
    declare progress_percent: number;
    declare completed_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ResourceProgress.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    resource_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    progress_percent: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    completed_at: {
        type: DataTypes.DATE,
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
    tableName: "resource_progress",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
