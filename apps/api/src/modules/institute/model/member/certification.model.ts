import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import sequelize from "../../../../config/database";
import { Member } from "./members.model";

export class Certification extends Model<InferAttributes<Certification>, InferCreationAttributes<Certification>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare issuing_organization: string;
    declare issue_date: Date;
    declare credential_url: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Foreign Key
    declare member_id: ForeignKey<Member["id"]>;
    
    // Non Attribute
    declare member?: NonAttribute<Member>;
}

Certification.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issuing_organization: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issue_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    credential_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
    member_id: {
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
    tableName: "certifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});