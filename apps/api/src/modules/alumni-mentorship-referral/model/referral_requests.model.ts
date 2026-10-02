import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ReferralRequests extends Model<InferAttributes<ReferralRequests>, InferCreationAttributes<ReferralRequests>> {
    declare id: CreationOptional<string>;
    declare referral_opportunity_id: string;
    declare student_member_id: string;
    declare resume_version_id: string;
    declare message: string;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ReferralRequests.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    referral_opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    student_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    resume_version_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
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
    tableName: "referral_requests",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
