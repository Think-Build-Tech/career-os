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

export class Project extends Model<InferAttributes<Project>, InferCreationAttributes<Project>> {
    declare id: CreationOptional<string>;
    declare member_id: ForeignKey<Member["id"]>;
    declare title: string;
    declare description: string;
    declare repository_url: string;
    declare demo_url: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;

    declare member?: NonAttribute<Member>;
}

Project.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    repository_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
    },
    demo_url: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isUrl: true,
        },
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
    tableName: "projects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
