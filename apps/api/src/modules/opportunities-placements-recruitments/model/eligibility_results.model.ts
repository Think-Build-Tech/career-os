import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EligibilityResults extends Model<InferAttributes<EligibilityResults>, InferCreationAttributes<EligibilityResults>> {
    declare id: CreationOptional<string>;
    declare opportunity_id: string;
    declare student_profile_id: string;
    declare eligible: boolean;
    declare failure_details: any;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EligibilityResults.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    student_profile_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    eligible: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
    },
    failure_details: {
        type: DataTypes.JSON,
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
    tableName: "eligibility_results",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
