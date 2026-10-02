import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EligibilityRuleSets extends Model<InferAttributes<EligibilityRuleSets>, InferCreationAttributes<EligibilityRuleSets>> {
    declare id: CreationOptional<string>;
    declare opportunity_id: string;
    declare version: number;
    declare active: boolean;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EligibilityRuleSets.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    opportunity_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    version: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    active: {
        type: DataTypes.BOOLEAN,
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
    tableName: "eligibility_rule_sets",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
