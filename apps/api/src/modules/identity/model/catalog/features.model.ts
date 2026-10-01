import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { TenantFeatures } from "../tenant/tenant_features.model";


export class FeaturesBase extends Model<InferAttributes<FeaturesBase>, InferCreationAttributes<FeaturesBase>> {
    declare id: CreationOptional<string>;
    declare code: string;
    declare name: string;
    declare default_enabled: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relationship mappings
    features?: NonAttribute<TenantFeatures[]>;
}

FeaturesBase.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    code: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    default_enabled:{
        type: DataTypes.BOOLEAN
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
},
{
    sequelize,
    tableName: 'feature'
});