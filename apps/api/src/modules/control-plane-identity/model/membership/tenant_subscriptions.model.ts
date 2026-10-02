import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "../tenant/tenants.model";
import { SubscriptionPlans } from "../catalog/subscription_plans";

export class TenantSubscription extends Model<InferAttributes<TenantSubscription>, InferCreationAttributes<TenantSubscription>> {
    declare id: CreationOptional<string>;
    declare status: string;
    declare started_at: Date;
    declare renews_at: Date;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relationship Mapping
    declare tenant_id: ForeignKey<Tenant['id']>
    declare plan_id: ForeignKey<SubscriptionPlans['id']>

    // Non Attribute Mapping
    declare tenant?: NonAttribute<Tenant>;
    declare plan?: NonAttribute<SubscriptionPlans>;
}

TenantSubscription.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
    started_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    renews_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    plan_id: {
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
    tableName: "tenant_subscriptions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});