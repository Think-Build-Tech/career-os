import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class PlacementDriveOpportunities extends Model<InferAttributes<PlacementDriveOpportunities>, InferCreationAttributes<PlacementDriveOpportunities>> {
    declare id: CreationOptional<string>;
    declare placement_drive_id: string;
    declare opportunity_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

PlacementDriveOpportunities.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    placement_drive_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
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
    tableName: "placement_drive_opportunities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
