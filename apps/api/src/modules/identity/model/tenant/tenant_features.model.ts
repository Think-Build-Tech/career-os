import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";
import { FeaturesBase } from "../catalog/features.model";

class TenantFeatures extends Model<InferAttributes<TenantFeatures>, InferCreationAttributes<TenantFeatures>> {
    declare id: CreationOptional<string>;
    declare enabled: boolean;
    declare configuration: object;

    // Relationship mapping
    declare tenant_id: ForeignKey<Tenant['id']>
    declare feature_id: ForeignKey<FeaturesBase['id']>;

    // Non attribute mapping for joins
    declare tenant?: NonAttribute<Tenant>;
    declare feature?: NonAttribute<FeaturesBase>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

TenantFeatures.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    enabled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    configuration: {
        type: DataTypes.JSON,
    },
    tenant_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    feature_id: {
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
    }
}, {
    sequelize,
    tableName: "tenant_features",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});

export { TenantFeatures };