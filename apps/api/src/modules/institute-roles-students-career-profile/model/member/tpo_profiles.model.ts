import {
    CreationOptional,
    DataTypes,
    ForeignKey,
    InferAttributes,
    InferCreationAttributes,
    Model,
    NonAttribute,
} from "sequelize";
import sequelize from "../../../../config/database";
import { Member } from "./members.model";

export class TpoProfile extends Model<InferAttributes<TpoProfile>, InferCreationAttributes<TpoProfile>> {
    declare id: CreationOptional<string>;
    declare designation: string;
    declare scope_type: string;
    declare department_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    // Foreign Key
    declare member_id: ForeignKey<Member["id"]>;

    // Non Attribute
    declare member?: NonAttribute<Member>;
}

TpoProfile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    designation: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    scope_type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    department_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
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
    tableName: "tpo_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});