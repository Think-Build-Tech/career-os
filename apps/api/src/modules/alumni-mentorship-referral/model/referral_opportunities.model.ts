import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class ReferralOpportunities extends Model<InferAttributes<ReferralOpportunities>, InferCreationAttributes<ReferralOpportunities>> {
    declare id: CreationOptional<string>;
    declare alumni_member_id: string;
    declare opportunity_id: string;
    declare referral_instructions: string;
    declare max_referrals: number;
    declare status: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

ReferralOpportunities.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    alumni_member_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    referral_instructions: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    max_referrals: {
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
    tableName: "referral_opportunities",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
