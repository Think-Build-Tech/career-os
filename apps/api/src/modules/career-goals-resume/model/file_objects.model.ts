import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class FileObjects extends Model<InferAttributes<FileObjects>, InferCreationAttributes<FileObjects>> {
    declare id: CreationOptional<string>;
    declare uploaded_by_member_id: string;
    declare object_key: string;
    declare original_filename: string;
    declare mime_type: string;
    declare size_bytes: number;
    declare classification: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

FileObjects.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    uploaded_by_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    object_key: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    original_filename: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    mime_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    size_bytes: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    classification: {
        type: DataTypes.STRING,
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
    tableName: "file_objects",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
