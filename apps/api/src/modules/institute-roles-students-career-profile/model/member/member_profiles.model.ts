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

export class MemberProfile extends Model<InferAttributes<MemberProfile>, InferCreationAttributes<MemberProfile>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare headline: string;
    declare bio: string;
    declare location: string;
    declare linkedin_url: string;
    declare github_url: string;
    declare portfolio_url: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
}

MemberProfile.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
    },
    headline: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    linkedin_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
    },
    github_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
    },
    portfolio_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isUrl: true },
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
    tableName: "member_profiles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
