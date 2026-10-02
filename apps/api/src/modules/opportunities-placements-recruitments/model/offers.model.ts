import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Offers extends Model<InferAttributes<Offers>, InferCreationAttributes<Offers>> {
    declare id: CreationOptional<string>;
    declare application_id: string;
    declare offered_role: string;
    declare package_amount: number;
    declare currency: string;
    declare joining_date: Date;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Offers.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    application_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    offered_role: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    package_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    joining_date: {
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
    tableName: "offers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
