import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { IdAccount } from "./id_accounts.model";


export class ExternalIdentity extends Model<InferAttributes<ExternalIdentity>, InferCreationAttributes<ExternalIdentity>>{
    declare id: CreationOptional<string>;
    declare provider: string;
    declare provider_subject: string;
    declare email: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Relation Mapping
    declare account_id: ForeignKey<IdAccount['id']>

    // Non Attribute Mapping
    declare account?: NonAttribute<IdAccount>;
}

ExternalIdentity.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    provider: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    provider_subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isEmail: true,
        },
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
    tableName: "external_identities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [{
        unique: true,
        fields: ["provider", "provider_subject"],
    }],
});
