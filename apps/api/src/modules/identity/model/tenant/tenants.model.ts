import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { TenantDomains } from "./tenant_domains.model";
import { TenantFeatures } from "./tenant_features.model";
import { TenantBranding } from "./tenant_brading.model";
import { TenantDatabaseRegistry } from "./tenant_database_registry.model";
import { TenantDeployments } from "./tenant_deployments.model";
import { TenantSubscription } from "../membership/tenant_subscriptions.model";
import { TenantInvitation } from "./tenant_invitations.model";
import { TenantAuthProvider } from "./tenant_auth_provider.model";
import { AccountTenantMembership } from "../membership/account_tenant_membership.model";
import { IdSession } from "../account/id_sessions.model";
export class Tenant extends Model<InferAttributes<Tenant>, InferCreationAttributes<Tenant>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare slug: string;
    declare legal_name: string;
    declare tenant_type: string;
    declare status: string;
    declare country_code: string;
    declare timezone: string;
    declare created_at: CreationOptional<Date>
    declare updated_at: CreationOptional<Date>
    

    // Relationships Mapping
    declare domains?: NonAttribute<TenantDomains[]>;
    declare tenant_features?: NonAttribute<TenantFeatures[]>;
    declare branding?: NonAttribute<TenantBranding>;
    declare database_registries?: NonAttribute<TenantDatabaseRegistry[]>;
    declare deployments?: NonAttribute<TenantDeployments[]>;
    declare subscriptions?: NonAttribute<TenantSubscription[]>;
    declare invitations?: NonAttribute<TenantInvitation[]>;
    declare auth_providers?: NonAttribute<TenantAuthProvider[]>;
    declare memberships?: NonAttribute<AccountTenantMembership[]>;
    declare sessions?: NonAttribute<IdSession[]>;
}

Tenant.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    legal_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tenant_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
    },
    country_code: {
        type: DataTypes.STRING,
    },
    timezone: {
        type: DataTypes.STRING,
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
},
{
    sequelize,
    tableName: 'tenant'
});
