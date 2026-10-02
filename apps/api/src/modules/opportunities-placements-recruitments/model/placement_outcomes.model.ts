import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class PlacementOutcomes extends Model<InferAttributes<PlacementOutcomes>, InferCreationAttributes<PlacementOutcomes>> {
    declare id: CreationOptional<string>;
    declare application_id: string;
    declare verification_status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

PlacementOutcomes.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    application_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    verification_status: {
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
    tableName: "placement_outcomes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
