import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EligibilityRuleGroups extends Model<InferAttributes<EligibilityRuleGroups>, InferCreationAttributes<EligibilityRuleGroups>> {
    declare id: CreationOptional<string>;
    declare rule_set_id: string;
    declare parent_group_id: string;
    declare logical_operator: string;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EligibilityRuleGroups.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    rule_set_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    parent_group_id: {
        type: DataTypes.UUID,
        allowNull: true,
    },
    logical_operator: {
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
    tableName: "eligibility_rule_groups",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
