import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";

export class TenantInvitation extends Model<InferAttributes<TenantInvitation>, InferCreationAttributes<TenantInvitation>> {
    declare id: CreationOptional<string>;
    declare invited_email: string;
    declare membership_type: string;
    declare status: string;
    declare expires_at: Date;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relationship Mapping
    declare tenant_id: ForeignKey<Tenant['id']>

    // Non Relation Mapping
    declare tenant?: NonAttribute<Tenant>;
}

TenantInvitation.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    invited_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    membership_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
    },
    expires_at: {
        type: DataTypes.DATE,
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
    tableName: "tenant_invitations",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});