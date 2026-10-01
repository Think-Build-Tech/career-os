import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { IdAccount } from "./id_accounts.model";
import { Tenant } from "../tenant/tenants.model";

export class IdSession extends Model<InferAttributes<IdSession>, InferCreationAttributes<IdSession>>{
    declare id: CreationOptional<string>;
    declare current_tenant_id: ForeignKey<Tenant['id']>;
    declare expires_at: Date;
    declare revoked_at: Date | null;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relation Mapping
    declare account_id: ForeignKey<IdAccount['id']>

    // Non Attribute Mapping
    declare account?: NonAttribute<IdAccount>;
    declare current_tenant?: NonAttribute<Tenant>;
}

IdSession.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    current_tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revoked_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    account_id: {
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
    tableName: "id_sessions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});