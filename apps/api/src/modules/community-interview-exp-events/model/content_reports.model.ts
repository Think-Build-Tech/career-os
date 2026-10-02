import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ContentReports extends Model<InferAttributes<ContentReports>, InferCreationAttributes<ContentReports>> {
    declare id: CreationOptional<string>;
    declare reporter_member_id: string;
    declare entity_type: string;
    declare entity_id: string;
    declare reason: string;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ContentReports.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    reporter_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    entity_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    entity_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    reason: {
        type: DataTypes.STRING,
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
    tableName: "content_reports",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
