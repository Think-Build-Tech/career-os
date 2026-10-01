import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";

export class TenantDatabaseRegistry extends Model<InferAttributes<TenantDatabaseRegistry>, InferCreationAttributes<TenantDatabaseRegistry>>{
    declare id: CreationOptional<string>;
    declare database_key: string;
    declare database_name: string;
    declare provider: string;
    declare region: string;
    declare secret_reference: string;
    declare schema_version: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    
    // Relationship Mapping
    declare tenant_id: ForeignKey<Tenant['id']>;

    // Non Attribute Mapping
    declare tenant?: NonAttribute<Tenant>;
}

TenantDatabaseRegistry.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    database_key: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    database_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secret_reference: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    schema_version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
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
    tableName: "tenant_database_registry",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});