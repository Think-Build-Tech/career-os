import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "../../../config/database";

export class EligibilityRules extends Model<InferAttributes<EligibilityRules>, InferCreationAttributes<EligibilityRules>> {
    declare id: CreationOptional<string>;
    declare group_id: string;
    declare field_code: string;
    declare operator: string;
    declare comparison_value: any;
    declare created_at: CreationOptional<Date>;
    declare updated_at: CreationOptional<Date>;
}

EligibilityRules.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    group_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    field_code: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    operator: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    comparison_value: {
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
    tableName: "eligibility_rules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
});
