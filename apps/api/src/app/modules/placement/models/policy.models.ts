import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from "../../../config/database";
import {
  createdAtAttribute,
  idAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import { PlacementSeason } from "./opportunity.models";

export class PlacementPolicy extends Model<
  InferAttributes<PlacementPolicy>,
  InferCreationAttributes<PlacementPolicy>
> {
  declare id: CreationOptional<string>;
  declare placement_season_id: ForeignKey<PlacementSeason["id"]>;
  declare name: string;
  declare scope_type: string;
  declare scope_id: CreationOptional<string | null>;
  declare version_number: number;
  declare status: CreationOptional<string>;
  declare effective_from: Date;
  declare effective_until: CreationOptional<Date | null>;
  declare created_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class PlacementPolicyRule extends Model<
  InferAttributes<PlacementPolicyRule>,
  InferCreationAttributes<PlacementPolicyRule>
> {
  declare id: CreationOptional<string>;
  declare policy_id: ForeignKey<PlacementPolicy["id"]>;
  declare rule_type: string;
  declare priority: CreationOptional<number>;
  declare rule_definition: Record<string, unknown>;
  declare enabled: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

PlacementPolicy.init(
  {
    id: idAttribute,
    placement_season_id: requiredUuid("placement_seasons", "CASCADE"),
    name: { type: DataTypes.STRING, allowNull: false },
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: optionalUuid(),
    version_number: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    effective_from: { type: DataTypes.DATE, allowNull: false },
    effective_until: { type: DataTypes.DATE, allowNull: true },
    created_by: optionalUuid("users"),
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_policies", "PlacementPolicy", {
    indexes: [
      { unique: true, fields: ["placement_season_id", "name", "version_number"] },
      { fields: ["scope_type", "scope_id"] },
      { fields: ["status"] },
    ],
  })
);

PlacementPolicyRule.init(
  {
    id: idAttribute,
    policy_id: requiredUuid("placement_policies", "CASCADE"),
    rule_type: { type: DataTypes.STRING(64), allowNull: false },
    priority: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    rule_definition: { type: DataTypes.JSONB, allowNull: false },
    enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_policy_rules", "PlacementPolicyRule", {
    indexes: [{ fields: ["policy_id", "priority"] }, { fields: ["rule_type"] }],
  })
);

PlacementPolicy.hasMany(PlacementPolicyRule, { foreignKey: "policy_id", as: "rules" });
PlacementPolicyRule.belongsTo(PlacementPolicy, { foreignKey: "policy_id", as: "policy" });

export default { PlacementPolicy, PlacementPolicyRule };
