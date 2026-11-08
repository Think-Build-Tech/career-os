import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
  NonAttribute,
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
import type { Company } from "../../company/models/company.models";
import type { ResumeVersion } from "../../resume/models/resume-version.model";
import type { StudentProfile } from "../../student/models/student.model";
import { DriveRound, PlacementDrive, PlacementTier } from "./drive.models";
import { JobOpportunity, PlacementSeason } from "./opportunity.models";

export class JobApplication extends Model<
  InferAttributes<JobApplication>,
  InferCreationAttributes<JobApplication>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare job_opportunity_id: ForeignKey<JobOpportunity["id"]>;
  declare drive_id: CreationOptional<ForeignKey<PlacementDrive["id"]> | null>;
  declare resume_version_id: ForeignKey<ResumeVersion["id"]>;
  declare status: CreationOptional<string>;
  declare applied_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare job_opportunity?: NonAttribute<JobOpportunity>;
  declare drive?: NonAttribute<PlacementDrive>;
  declare resume_version?: NonAttribute<ResumeVersion>;
  declare status_history?: NonAttribute<ApplicationStatusHistory[]>;
  declare round_results?: NonAttribute<StudentRoundResult[]>;
  declare offer?: NonAttribute<JobOffer>;
}

export class ApplicationStatusHistory extends Model<
  InferAttributes<ApplicationStatusHistory>,
  InferCreationAttributes<ApplicationStatusHistory>
> {
  declare id: CreationOptional<string>;
  declare application_id: ForeignKey<JobApplication["id"]>;
  declare from_status: CreationOptional<string | null>;
  declare to_status: string;
  declare changed_by: CreationOptional<string | null>;
  declare reason: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare application?: NonAttribute<JobApplication>;
}

export class StudentRoundResult extends Model<
  InferAttributes<StudentRoundResult>,
  InferCreationAttributes<StudentRoundResult>
> {
  declare id: CreationOptional<string>;
  declare application_id: ForeignKey<JobApplication["id"]>;
  declare drive_round_id: ForeignKey<DriveRound["id"]>;
  declare status: string;
  declare score: CreationOptional<number | null>;
  declare notes: CreationOptional<string | null>;
  declare evaluated_by: CreationOptional<string | null>;
  declare evaluated_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare application?: NonAttribute<JobApplication>;
  declare drive_round?: NonAttribute<DriveRound>;
}

export class JobOffer extends Model<
  InferAttributes<JobOffer>,
  InferCreationAttributes<JobOffer>
> {
  declare id: CreationOptional<string>;
  declare application_id: ForeignKey<JobApplication["id"]>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare job_opportunity_id: ForeignKey<JobOpportunity["id"]>;
  declare company_id: CreationOptional<ForeignKey<Company["id"]> | null>;
  declare placement_tier_id: CreationOptional<ForeignKey<PlacementTier["id"]> | null>;
  declare status: CreationOptional<string>;
  declare compensation: CreationOptional<number | null>;
  declare total_ctc: CreationOptional<number | null>;
  declare currency: CreationOptional<string>;
  declare offer_date: CreationOptional<Date | null>;
  declare decision_deadline: CreationOptional<Date | null>;
  declare joining_date: CreationOptional<Date | null>;
  declare offer_letter_object_key: CreationOptional<string | null>;
  declare accepted_at: CreationOptional<Date | null>;
  declare declined_at: CreationOptional<Date | null>;
  declare decline_reason: CreationOptional<string | null>;
  declare signed_document_object_key: CreationOptional<string | null>;
  declare signature_reference: CreationOptional<string | null>;
  declare offered_at: CreationOptional<Date>;
  declare responded_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare application?: NonAttribute<JobApplication>;
  declare student?: NonAttribute<StudentProfile>;
  declare job_opportunity?: NonAttribute<JobOpportunity>;
  declare company?: NonAttribute<Company>;
  declare tier?: NonAttribute<PlacementTier>;
  declare compensation_components?: NonAttribute<OfferCompensationComponent[]>;
}

export class OfferCompensationComponent extends Model<
  InferAttributes<OfferCompensationComponent>,
  InferCreationAttributes<OfferCompensationComponent>
> {
  declare id: CreationOptional<string>;
  declare job_offer_id: ForeignKey<JobOffer["id"]>;
  declare component_type: string;
  declare amount: number;
  declare currency: CreationOptional<string>;
  declare frequency: CreationOptional<string>;
  declare description: CreationOptional<string | null>;
  declare is_guaranteed: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare job_offer?: NonAttribute<JobOffer>;
}

export class PlacementRecord extends Model<
  InferAttributes<PlacementRecord>,
  InferCreationAttributes<PlacementRecord>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare placement_season_id: ForeignKey<PlacementSeason["id"]>;
  declare job_offer_id: CreationOptional<ForeignKey<JobOffer["id"]> | null>;
  declare company_id: ForeignKey<string>;
  declare job_opportunity_id: CreationOptional<ForeignKey<JobOpportunity["id"]> | null>;
  declare placement_type: string;
  declare role_title: string;
  declare compensation: CreationOptional<number | null>;
  declare placed_at: Date;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare season?: NonAttribute<PlacementSeason>;
  declare company?: NonAttribute<Company>;
  declare job_offer?: NonAttribute<JobOffer>;
}

JobApplication.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    job_opportunity_id: requiredUuid("job_opportunities", "RESTRICT"),
    drive_id: optionalUuid("placement_drives"),
    resume_version_id: requiredUuid("resume_versions", "RESTRICT"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "SUBMITTED" },
    applied_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "job_applications", "JobApplication", {
    indexes: [
      { unique: true, fields: ["student_id", "job_opportunity_id", "drive_id"] },
      { fields: ["student_id"] },
      { fields: ["drive_id"] },
      { fields: ["job_opportunity_id"] },
      { fields: ["status"] },
    ],
  })
);

ApplicationStatusHistory.init(
  {
    id: idAttribute,
    application_id: requiredUuid("job_applications", "CASCADE"),
    from_status: { type: DataTypes.STRING(32), allowNull: true },
    to_status: { type: DataTypes.STRING(32), allowNull: false },
    changed_by: optionalUuid("users"),
    reason: { type: DataTypes.TEXT, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "application_status_history", "ApplicationStatusHistory", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["application_id", "created_at"] }],
  })
);

StudentRoundResult.init(
  {
    id: idAttribute,
    application_id: requiredUuid("job_applications", "CASCADE"),
    drive_round_id: requiredUuid("drive_rounds", "CASCADE"),
    status: { type: DataTypes.STRING(32), allowNull: false },
    score: { type: DataTypes.DECIMAL(7, 2), allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    evaluated_by: optionalUuid("users"),
    evaluated_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_round_results", "StudentRoundResult", {
    indexes: [{ unique: true, fields: ["application_id", "drive_round_id"] }],
  })
);

JobOffer.init(
  {
    id: idAttribute,
    application_id: { ...requiredUuid("job_applications", "RESTRICT"), unique: true },
    student_id: requiredUuid("student_profiles", "RESTRICT"),
    job_opportunity_id: requiredUuid("job_opportunities", "RESTRICT"),
    company_id: optionalUuid("companies"),
    placement_tier_id: optionalUuid("placement_tiers"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "OFFERED" },
    compensation: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    total_ctc: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: "INR" },
    offer_date: { type: DataTypes.DATEONLY, allowNull: true },
    decision_deadline: { type: DataTypes.DATE, allowNull: true },
    joining_date: { type: DataTypes.DATEONLY, allowNull: true },
    offer_letter_object_key: { type: DataTypes.STRING(2048), allowNull: true },
    accepted_at: { type: DataTypes.DATE, allowNull: true },
    declined_at: { type: DataTypes.DATE, allowNull: true },
    decline_reason: { type: DataTypes.TEXT, allowNull: true },
    signed_document_object_key: { type: DataTypes.STRING(2048), allowNull: true },
    signature_reference: { type: DataTypes.STRING(255), allowNull: true },
    offered_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    responded_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "job_offers", "JobOffer", {
    indexes: [
      { fields: ["student_id", "status"] },
      { fields: ["job_opportunity_id"] },
      { fields: ["company_id"] },
      { fields: ["placement_tier_id"] },
    ],
  })
);

OfferCompensationComponent.init(
  {
    id: idAttribute,
    job_offer_id: requiredUuid("job_offers", "CASCADE"),
    component_type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(14, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(8),
      allowNull: false,
      defaultValue: "INR",
    },
    frequency: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "ANNUAL",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_guaranteed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "offer_compensation_components", "OfferCompensationComponent", {
    indexes: [
      { fields: ["job_offer_id"] },
      { fields: ["component_type"] },
    ],
  })
);

PlacementRecord.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "RESTRICT"),
    placement_season_id: requiredUuid("placement_seasons", "RESTRICT"),
    job_offer_id: optionalUuid("job_offers"),
    company_id: requiredUuid("companies", "RESTRICT"),
    job_opportunity_id: optionalUuid("job_opportunities"),
    placement_type: { type: DataTypes.STRING(32), allowNull: false },
    role_title: { type: DataTypes.STRING, allowNull: false },
    compensation: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    placed_at: { type: DataTypes.DATE, allowNull: false },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_records", "PlacementRecord", {
    indexes: [
      { fields: ["student_id"] },
      { fields: ["placement_season_id"] },
      { fields: ["company_id"] },
    ],
  })
);

JobApplication.hasMany(ApplicationStatusHistory, { foreignKey: "application_id", as: "status_history" });
ApplicationStatusHistory.belongsTo(JobApplication, { foreignKey: "application_id", as: "application" });
JobApplication.hasMany(StudentRoundResult, { foreignKey: "application_id", as: "round_results" });
StudentRoundResult.belongsTo(JobApplication, { foreignKey: "application_id", as: "application" });
JobApplication.hasOne(JobOffer, { foreignKey: "application_id", as: "offer" });
JobOffer.belongsTo(JobApplication, { foreignKey: "application_id", as: "application" });

JobOffer.hasMany(OfferCompensationComponent, { foreignKey: "job_offer_id", as: "compensation_components" });
OfferCompensationComponent.belongsTo(JobOffer, { foreignKey: "job_offer_id", as: "job_offer" });

export default {
  JobApplication,
  ApplicationStatusHistory,
  StudentRoundResult,
  JobOffer,
  OfferCompensationComponent,
  PlacementRecord,
};
