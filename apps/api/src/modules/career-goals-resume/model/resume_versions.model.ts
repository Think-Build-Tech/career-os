import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ResumeVersions extends Model<InferAttributes<ResumeVersions>, InferCreationAttributes<ResumeVersions>> {
    declare id: CreationOptional<string>;
    declare resume_id: string;
    declare version_number: number;
    declare file_object_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ResumeVersions.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    resume_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    version_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    file_object_id: {
        type: DataTypes.UUID,
        allowNull: true,
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
    tableName: "resume_versions",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
