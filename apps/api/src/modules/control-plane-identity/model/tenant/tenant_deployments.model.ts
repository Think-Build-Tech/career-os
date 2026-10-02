import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";

export class TenantDeployments extends Model<InferAttributes<TenantDeployments>, InferCreationAttributes<TenantDeployments>> {
    declare id: CreationOptional<string>;
    declare deployment_mode: string;
    declare environment: string;
    declare region: string;
    declare routing_target: string;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relationship mapping
    declare tenant_id: ForeignKey<Tenant['id']>

    // Non Attribute Mapping
    declare tenant?: NonAttribute<Tenant>
}

TenantDeployments.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    deployment_mode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    environment: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    region: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    routing_target: {
        type: DataTypes.STRING,
        allowNull: false,
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
    tableName: "tenant_deployments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});