import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class InstituteCompanies extends Model<InferAttributes<InstituteCompanies>, InferCreationAttributes<InstituteCompanies>> {
    declare id: CreationOptional<string>;
    declare global_company_id: string;
    declare company_name: string;
    declare relationship_status: string;
    declare internal_notes: string;
    declare active: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

InstituteCompanies.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    global_company_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    relationship_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    internal_notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
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
    tableName: "institute_companies",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
