import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ApplicationStatusHistory extends Model<InferAttributes<ApplicationStatusHistory>, InferCreationAttributes<ApplicationStatusHistory>> {
    declare id: CreationOptional<string>;
    declare application_id: string;
    declare from_status: string;
    declare to_status: string;
    declare changed_at: Date;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ApplicationStatusHistory.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    application_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    from_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    to_status: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    changed_at: {
        type: DataTypes.DATE,
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
    tableName: "application_status_history",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
