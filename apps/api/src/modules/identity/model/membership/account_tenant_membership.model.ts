import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "../tenant/tenants.model";
import { IdAccount } from "../account/id_accounts.model";


export class AccountTenantMembership extends Model<InferAttributes<AccountTenantMembership>, InferCreationAttributes<AccountTenantMembership>>{
    declare id: CreationOptional<string>;
    declare membership_type: string;
    declare status: string;
    declare joined_at: CreationOptional<Date>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relation Mapping
    declare account_id: ForeignKey<IdAccount['id']>;
    declare tenant_id: ForeignKey<Tenant['id']>;;

    // Non Attribute Mapping
    declare account?: NonAttribute<IdAccount>;
    declare tenant?: NonAttribute<Tenant>;
}

AccountTenantMembership.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    membership_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
    },
    joined_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    account_id: {
        type: DataTypes.UUID,
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
    tableName: "account_tenant_memberships",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});