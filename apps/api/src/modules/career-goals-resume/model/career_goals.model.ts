import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class CareerGoals extends Model<InferAttributes<CareerGoals>, InferCreationAttributes<CareerGoals>> {
    declare id: CreationOptional<string>;
    declare member_id: string;
    declare global_career_role_id: string;
    declare target_role_name_snapshot: string;
    declare priority: number;
    declare target_date: Date;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

CareerGoals.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    global_career_role_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    target_role_name_snapshot: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    target_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    status: {
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
    tableName: "career_goals",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
