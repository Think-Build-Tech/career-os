import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Tenant } from "./tenants.model";


export class TenantDomains extends Model<InferAttributes<TenantDomains>, InferCreationAttributes<TenantDomains>>{
    declare id: CreationOptional<string>;
    declare hostname: string;
    declare domain_type: string;
    declare is_primary: boolean;
    declare verification_status: string;
    declare tls_status: string;
    declare verified_at: CreationOptional<Date>;

    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relationship Mapping


    // ForeignKeys
    declare tenant_id: ForeignKey<Tenant['id']>;



    // Non Attributes Mapping
    declare tenant?: NonAttribute<Tenant>;
}

TenantDomains.init({
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    hostname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    domain_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    verification_status:{
        type: DataTypes.STRING,
        defaultValue: "unverified"
    },
    tls_status: {
        type: DataTypes.STRING,
    },
    verified_at: DataTypes.DATE,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
},
{
    sequelize,
    tableName: 'tenant_domains'
})
