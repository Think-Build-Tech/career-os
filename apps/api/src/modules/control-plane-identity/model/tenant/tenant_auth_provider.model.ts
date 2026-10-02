import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";

export class TenantAuthProvider extends Model<InferAttributes<TenantAuthProvider>, InferCreationAttributes<TenantAuthProvider>> {
    declare id: CreationOptional<string>;
    declare provider_type: string;
    declare display_name: string;
    declare issuer_url: string;
    declare client_id: string;
    declare enabled: boolean;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relation Mapping

    declare tenant_id: ForeignKey<Tenant['id']>

    // Non Attribute Mapping
    declare tenant?: NonAttribute<Tenant>;
}

TenantAuthProvider.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    provider_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuer_url: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    client_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
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
    tableName: "tenant_auth_providers",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});