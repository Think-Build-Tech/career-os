import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { TenantSubscription } from "../membership/tenant_subscriptions.model";


export class SubscriptionPlans extends Model<InferAttributes<SubscriptionPlans>, InferCreationAttributes<SubscriptionPlans>>{
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;
    declare billing_period: string;
    declare base_price: number;
    declare max_users: number;
    declare monthly_ai_credits: bigint
    declare subscriptions?: NonAttribute<TenantSubscription[]>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

SubscriptionPlans.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
    },
    name: DataTypes.STRING,
    billing_period: DataTypes.STRING,
    base_price: DataTypes.DECIMAL,
    max_users: DataTypes.INTEGER,
    monthly_ai_credits: DataTypes.BIGINT,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
},
{
    sequelize,
    tableName: "subscription_plans"
});

