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
import type { Company } from "../../company/models/company.models";
import type { StudentProfile } from "../../student/models/student.model";

export class PlacementSeason extends Model<
  InferAttributes<PlacementSeason>,
  InferCreationAttributes<PlacementSeason>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare start_date: Date;
  declare end_date: Date;
  declare status: CreationOptional<string>;
  declare settings: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class JobOpportunity extends Model<
  InferAttributes<JobOpportunity>,
  InferCreationAttributes<JobOpportunity>
> {
  declare id: CreationOptional<string>;
  declare company_id: ForeignKey<Company["id"]>;
  declare placement_season_id: CreationOptional<ForeignKey<PlacementSeason["id"]> | null>;
  declare title: string;
  declare source: string;
  declare employment_type: string;
  declare work_mode: string;
  declare location: CreationOptional<string | null>;
  declare compensation_min: CreationOptional<number | null>;
  declare compensation_max: CreationOptional<number | null>;
  declare application_url: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_by: CreationOptional<string | null>;
  declare published_at: CreationOptional<Date | null>;
  declare closes_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class JobDescriptionVersion extends Model<
  InferAttributes<JobDescriptionVersion>,
  InferCreationAttributes<JobDescriptionVersion>
> {
  declare id: CreationOptional<string>;
  declare job_opportunity_id: ForeignKey<JobOpportunity["id"]>;
  declare version_number: number;
  declare content: string;
  declare structured_data: CreationOptional<Record<string, unknown>>;
  declare content_hash: string;
  declare created_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
}

export class OpportunitySubmission extends Model<
  InferAttributes<OpportunitySubmission>,
  InferCreationAttributes<OpportunitySubmission>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare company_name: string;
  declare title: string;
  declare source_url: string;
  declare submission_data: CreationOptional<Record<string, unknown>>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class OpportunityVerification extends Model<
  InferAttributes<OpportunityVerification>,
  InferCreationAttributes<OpportunityVerification>
> {
  declare id: CreationOptional<string>;
  declare submission_id: ForeignKey<OpportunitySubmission["id"]>;
  declare verification_type: string;
  declare status: string;
  declare score: CreationOptional<number | null>;
  declare result: CreationOptional<Record<string, unknown>>;
  declare checked_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
}

export class SubmissionReview extends Model<
  InferAttributes<SubmissionReview>,
  InferCreationAttributes<SubmissionReview>
> {
  declare id: CreationOptional<string>;
  declare submission_id: ForeignKey<OpportunitySubmission["id"]>;
  declare reviewer_user_id: ForeignKey<string>;
  declare decision: string;
  declare notes: CreationOptional<string | null>;
  declare published_job_id: CreationOptional<ForeignKey<JobOpportunity["id"]> | null>;
  declare created_at: CreationOptional<Date>;
}

PlacementSeason.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    settings: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "placement_seasons", "PlacementSeason")
);

JobOpportunity.init(
  {
    id: idAttribute,
    company_id: requiredUuid("companies", "RESTRICT"),
    placement_season_id: optionalUuid("placement_seasons"),
    title: { type: DataTypes.STRING, allowNull: false },
    source: { type: DataTypes.STRING(32), allowNull: false },
    employment_type: { type: DataTypes.STRING(32), allowNull: false },
    work_mode: { type: DataTypes.STRING(32), allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    compensation_min: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    compensation_max: { type: DataTypes.DECIMAL(14, 2), allowNull: true },
    application_url: { type: DataTypes.STRING(2048), allowNull: true, validate: { isUrl: true } },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    created_by: optionalUuid("users"),
    published_at: { type: DataTypes.DATE, allowNull: true },
    closes_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "job_opportunities", "JobOpportunity", {
    indexes: [
      { fields: ["company_id"] },
      { fields: ["placement_season_id"] },
      { fields: ["source", "status"] },
    ],
  })
);

JobDescriptionVersion.init(
  {
    id: idAttribute,
    job_opportunity_id: requiredUuid("job_opportunities", "CASCADE"),
    version_number: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    content: { type: DataTypes.TEXT, allowNull: false },
    structured_data: jsonObjectAttribute,
    content_hash: { type: DataTypes.STRING(128), allowNull: false },
    created_by: optionalUuid("users"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "job_description_versions", "JobDescriptionVersion", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["job_opportunity_id", "version_number"] },
      { fields: ["content_hash"] },
    ],
  })
);

OpportunitySubmission.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    company_name: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    source_url: { type: DataTypes.STRING(2048), allowNull: false, validate: { isUrl: true } },
    submission_data: jsonObjectAttribute,
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING_VERIFICATION" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "opportunity_submissions", "OpportunitySubmission", {
    indexes: [{ fields: ["student_id"] }, { fields: ["status"] }, { fields: ["source_url"] }],
  })
);

OpportunityVerification.init(
  {
    id: idAttribute,
    submission_id: requiredUuid("opportunity_submissions", "CASCADE"),
    verification_type: { type: DataTypes.STRING(64), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false },
    score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    result: jsonObjectAttribute,
    checked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "opportunity_verifications", "OpportunityVerification", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["submission_id"] }, { fields: ["verification_type", "status"] }],
  })
);

SubmissionReview.init(
  {
    id: idAttribute,
    submission_id: requiredUuid("opportunity_submissions", "CASCADE"),
    reviewer_user_id: requiredUuid("users", "RESTRICT"),
    decision: { type: DataTypes.STRING(32), allowNull: false },
    notes: { type: DataTypes.TEXT, allowNull: true },
    published_job_id: optionalUuid("job_opportunities"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "submission_reviews", "SubmissionReview", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["submission_id"] }, { fields: ["reviewer_user_id"] }],
  })
);

PlacementSeason.hasMany(JobOpportunity, { foreignKey: "placement_season_id", as: "opportunities" });
JobOpportunity.belongsTo(PlacementSeason, { foreignKey: "placement_season_id", as: "season" });
JobOpportunity.hasMany(JobDescriptionVersion, { foreignKey: "job_opportunity_id", as: "description_versions" });
JobDescriptionVersion.belongsTo(JobOpportunity, { foreignKey: "job_opportunity_id", as: "job_opportunity" });
OpportunitySubmission.hasMany(OpportunityVerification, { foreignKey: "submission_id", as: "verifications" });
OpportunitySubmission.hasMany(SubmissionReview, { foreignKey: "submission_id", as: "reviews" });

export default {
  PlacementSeason,
  JobOpportunity,
  JobDescriptionVersion,
  OpportunitySubmission,
  OpportunityVerification,
  SubmissionReview,
};
