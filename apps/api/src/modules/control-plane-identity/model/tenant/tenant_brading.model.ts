import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";

export class TenantBranding extends Model<InferAttributes<TenantBranding>, InferCreationAttributes<TenantBranding>> {
    declare id: CreationOptional<string>;
    declare portal_name: string;
    declare logo_url: string;
    declare primary_color: string;
    declare secondary_color: string;
    declare favicon_url: string;

    // Relationship mapping
    declare tenant_id: ForeignKey<Tenant['id']>;

    // Non Attribute Mapping
    declare tenant?: NonAttribute<Tenant>;


    declare created_at: CreationOptional<Date>
    declare updated_at: CreationOptional<Date>
}

TenantBranding.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    portal_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    primary_color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secondary_color: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    favicon_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tenant_id: {
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
    tableName: "tenant_branding",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

