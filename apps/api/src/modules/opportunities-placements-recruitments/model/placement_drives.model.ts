import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class PlacementDrives extends Model<InferAttributes<PlacementDrives>, InferCreationAttributes<PlacementDrives>> {
    declare id: CreationOptional<string>;
    declare institute_company_id: string;
    declare title: string;
    declare academic_year: string;
    declare coordinator_member_id: string;
    declare start_date: Date;
    declare end_date: Date;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

PlacementDrives.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    institute_company_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    academic_year: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    coordinator_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    end_date: {
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
    tableName: "placement_drives",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
