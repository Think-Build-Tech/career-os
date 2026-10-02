import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class OpportunitySubmissions extends Model<InferAttributes<OpportunitySubmissions>, InferCreationAttributes<OpportunitySubmissions>> {
    declare id: CreationOptional<string>;
    declare submitted_by_member_id: string;
    declare company_name: string;
    declare global_company_id: string;
    declare title: string;
    declare opportunity_type: string;
    declare application_url: string;
    declare deadline: Date;
    declare source_url: string;
    declare status: string;
    declare approved_opportunity_id: string;
    declare submitted_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

OpportunitySubmissions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    submitted_by_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    company_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    global_company_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    opportunity_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    application_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    source_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    approved_opportunity_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    submitted_at: {
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
    tableName: "opportunity_submissions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
