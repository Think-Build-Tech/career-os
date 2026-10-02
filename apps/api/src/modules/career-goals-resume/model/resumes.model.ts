import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Resumes extends Model<InferAttributes<Resumes>, InferCreationAttributes<Resumes>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare name: string;
    declare resume_type: string;
    declare is_primary: boolean;
    declare current_version_id: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Resumes.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    resume_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    is_primary: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    current_version_id: {
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
    tableName: "resumes",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
