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
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { Department } from "../../department/department.model";
import type { StudentProfile } from "../../student/models/student.model";
import { JobOpportunity, PlacementSeason } from "./opportunity.models";

export class PlacementTier extends Model<
  InferAttributes<PlacementTier>,
  InferCreationAttributes<PlacementTier>
> {
  declare id: CreationOptional<string>;
  declare placement_season_id: ForeignKey<PlacementSeason["id"]>;
  declare name: string;
  declare code: string;
  declare rank: number;
  declare minimum_compensation: CreationOptional<number | null>;
  declare maximum_compensation: CreationOptional<number | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class PlacementDrive extends Model<
  InferAttributes<PlacementDrive>,
  InferCreationAttributes<PlacementDrive>
> {
  declare id: CreationOptional<string>;
  declare job_opportunity_id: ForeignKey<JobOpportunity["id"]>;
  declare placement_season_id: ForeignKey<PlacementSeason["id"]>;
  declare placement_tier_id: CreationOptional<ForeignKey<PlacementTier["id"]> | null>;
  declare name: string;
  declare status: CreationOptional<string>;
  declare starts_at: CreationOptional<Date | null>;
  declare ends_at: CreationOptional<Date | null>;
  declare settings: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class DriveDepartment extends Model<
  InferAttributes<DriveDepartment>,
  InferCreationAttributes<DriveDepartment>
> {
  declare id: CreationOptional<string>;
  declare drive_id: ForeignKey<PlacementDrive["id"]>;
  declare department_id: ForeignKey<Department["id"]>;
  declare eligibility_overrides: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class DriveRound extends Model<
  InferAttributes<DriveRound>,
  InferCreationAttributes<DriveRound>
> {
  declare id: CreationOptional<string>;
  declare drive_id: ForeignKey<PlacementDrive["id"]>;
  declare name: string;
  declare round_type: string;
  declare sequence_number: number;
  declare scheduled_at: CreationOptional<Date | null>;
  declare status: CreationOptional<string>;
  declare settings: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class EligibilityRuleSet extends Model<
  InferAttributes<EligibilityRuleSet>,
  InferCreationAttributes<EligibilityRuleSet>
> {
  declare id: CreationOptional<string>;
  declare drive_id: ForeignKey<PlacementDrive["id"]>;
  declare department_id: CreationOptional<ForeignKey<Department["id"]> | null>;
  declare version_number: number;
  declare rules: Record<string, unknown>;
  declare status: CreationOptional<string>;
  declare effective_from: CreationOptional<Date>;
  declare created_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
}

export class EligibilityEvaluation extends Model<
  InferAttributes<EligibilityEvaluation>,
  InferCreationAttributes<EligibilityEvaluation>
> {
  declare id: CreationOptional<string>;
  declare rule_set_id: ForeignKey<EligibilityRuleSet["id"]>;
  declare drive_id: ForeignKey<PlacementDrive["id"]>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare eligible: boolean;
  declare evaluation_snapshot: Record<string, unknown>;
  declare evaluated_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
}

PlacementTier.init(
  {
    id: idAttribute,
    placement_season_id: requiredUuid("placement_seasons", "CASCADE"),
    name: { type: DataTypes.STRING(100), allowNull: false },
    code: { type: DataTypes.STRING(32), allowNull: false },
    rank: { type: DataTypes.SMALLINT, allowNull: false, validate: { min: 1 } },
    minimum_compensation: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    maximum_compensation: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_tiers", "PlacementTier", {
    indexes: [
      { unique: true, fields: ["placement_season_id", "code"] },
      { unique: true, fields: ["placement_season_id", "rank"] },
    ],
  })
);

PlacementDrive.init(
  {
    id: idAttribute,
    job_opportunity_id: requiredUuid("job_opportunities", "RESTRICT"),
    placement_season_id: requiredUuid("placement_seasons", "RESTRICT"),
    placement_tier_id: optionalUuid("placement_tiers"),
    name: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    starts_at: { type: DataTypes.DATE, allowNull: true },
    ends_at: { type: DataTypes.DATE, allowNull: true },
    settings: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_drives", "PlacementDrive", {
    indexes: [
      { fields: ["placement_season_id"] },
      { fields: ["job_opportunity_id"] },
      { fields: ["status"] },
    ],
  })
);

DriveDepartment.init(
  {
    id: idAttribute,
    drive_id: requiredUuid("placement_drives", "CASCADE"),
    department_id: requiredUuid("departments", "RESTRICT"),
    eligibility_overrides: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "drive_departments", "DriveDepartment", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["drive_id", "department_id"] },
      { fields: ["department_id"] },
    ],
  })
);

DriveRound.init(
  {
    id: idAttribute,
    drive_id: requiredUuid("placement_drives", "CASCADE"),
    name: { type: DataTypes.STRING(120), allowNull: false },
    round_type: { type: DataTypes.STRING(64), allowNull: false },
    sequence_number: { type: DataTypes.SMALLINT, allowNull: false, validate: { min: 1 } },
    scheduled_at: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    settings: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "drive_rounds", "DriveRound", {
    indexes: [{ unique: true, fields: ["drive_id", "sequence_number"] }],
  })
);

EligibilityRuleSet.init(
  {
    id: idAttribute,
    drive_id: requiredUuid("placement_drives", "CASCADE"),
    department_id: optionalUuid("departments"),
    version_number: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    rules: { type: DataTypes.JSONB, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    effective_from: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_by: optionalUuid("users"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "eligibility_rule_sets", "EligibilityRuleSet", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["drive_id", "department_id", "version_number"] },
      { fields: ["status"] },
    ],
  })
);

EligibilityEvaluation.init(
  {
    id: idAttribute,
    rule_set_id: requiredUuid("eligibility_rule_sets", "RESTRICT"),
    drive_id: requiredUuid("placement_drives", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    eligible: { type: DataTypes.BOOLEAN, allowNull: false },
    evaluation_snapshot: { type: DataTypes.JSONB, allowNull: false },
    evaluated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "eligibility_evaluations", "EligibilityEvaluation", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["student_id", "drive_id"] },
      { fields: ["drive_id", "eligible"] },
      { fields: ["rule_set_id"] },
    ],
  })
);

PlacementDrive.hasMany(DriveDepartment, { foreignKey: "drive_id", as: "drive_departments" });
DriveDepartment.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
PlacementDrive.hasMany(DriveRound, { foreignKey: "drive_id", as: "rounds" });
DriveRound.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
PlacementDrive.hasMany(EligibilityRuleSet, { foreignKey: "drive_id", as: "eligibility_rule_sets" });
EligibilityRuleSet.belongsTo(PlacementDrive, { foreignKey: "drive_id", as: "drive" });
EligibilityRuleSet.hasMany(EligibilityEvaluation, { foreignKey: "rule_set_id", as: "evaluations" });

export default {
  PlacementTier,
  PlacementDrive,
  DriveDepartment,
  DriveRound,
  EligibilityRuleSet,
  EligibilityEvaluation,
};
