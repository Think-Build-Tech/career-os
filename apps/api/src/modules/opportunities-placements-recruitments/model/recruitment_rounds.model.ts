import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class RecruitmentRounds extends Model<InferAttributes<RecruitmentRounds>, InferCreationAttributes<RecruitmentRounds>> {
    declare id: CreationOptional<string>;
    declare placement_drive_id: string;
    declare opportunity_id: string;
    declare name: string;
    declare round_type: string;
    declare sequence_no: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

RecruitmentRounds.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    placement_drive_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    round_type: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sequence_no: {
        type: DataTypes.INTEGER,
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
    tableName: "recruitment_rounds",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
