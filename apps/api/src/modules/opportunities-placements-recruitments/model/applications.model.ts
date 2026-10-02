import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class Applications extends Model<InferAttributes<Applications>, InferCreationAttributes<Applications>> {
    declare id: CreationOptional<string>;
    declare opportunity_id: string;
    declare student_member_id: string;
    declare current_status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

Applications.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    student_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    current_status: {
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
    tableName: "applications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
