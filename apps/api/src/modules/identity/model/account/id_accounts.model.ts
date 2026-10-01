import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { AccountTenantMembership } from "../membership/account_tenant_membership.model";
import { ExternalIdentity } from "./external_identities.model";
import { IdSession } from "./id_sessions.model";

export class IdAccount extends Model<InferAttributes<IdAccount>, InferCreationAttributes<IdAccount>> {
    declare id: CreationOptional<string>;
    declare primary_email: string;
    declare first_name: string;
    declare last_name: string;
    declare display_name: string;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
    declare memberships?: NonAttribute<AccountTenantMembership[]>;
    declare external_identities?: NonAttribute<ExternalIdentity[]>;
    declare sessions?: NonAttribute<IdSession[]>;
}

IdAccount.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    primary_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active",
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
    tableName: "id_accounts",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});