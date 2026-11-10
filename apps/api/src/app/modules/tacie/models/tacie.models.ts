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
  jsonArrayAttribute,
  jsonObjectAttribute,
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import { User } from "../../user/user.model";

export class AiRun extends Model<InferAttributes<AiRun>, InferCreationAttributes<AiRun>> {
  declare id: CreationOptional<string>;
  declare run_type: string;
  declare model_name: string;
  declare model_version: string;
  declare input_snapshot_hash: string;
  declare status: CreationOptional<string>;
  declare prompt_tokens: CreationOptional<number | null>;
  declare completion_tokens: CreationOptional<number | null>;
  declare estimated_cost: CreationOptional<number | null>;
  declare error_details: CreationOptional<Record<string, unknown> | null>;
  declare started_at: CreationOptional<Date>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
}

export class AiUsageRecord extends Model<
  InferAttributes<AiUsageRecord>,
  InferCreationAttributes<AiUsageRecord>
> {
  declare id: CreationOptional<string>;
  declare request_id: string;
  declare client_id: string;
  declare application_id: CreationOptional<string | null>;
  declare signature_type: string;
  declare provider: string;
  declare model_name: string;
  declare status: string;
  declare input_tokens: CreationOptional<number | null>;
  declare output_tokens: CreationOptional<number | null>;
  declare total_tokens: CreationOptional<number | null>;
  declare latency_ms: number;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare error_code: CreationOptional<string | null>;
  declare error_message: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
}

export class ResumeAnalysis extends Model<
  InferAttributes<ResumeAnalysis>,
  InferCreationAttributes<ResumeAnalysis>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<string>;
  declare resume_version_id: ForeignKey<string>;
  declare job_opportunity_id: CreationOptional<string | null>;
  declare job_description_version_id: CreationOptional<string | null>;
  declare ai_run_id: ForeignKey<AiRun["id"]>;
  declare match_score: CreationOptional<number | null>;
  declare keyword_score: CreationOptional<number | null>;
  declare experience_score: CreationOptional<number | null>;
  declare skills_score: CreationOptional<number | null>;
  declare education_score: CreationOptional<number | null>;
  declare missing_keywords: CreationOptional<string[]>;
  declare recommendations: CreationOptional<unknown[]>;
  declare analysis_data: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class CandidateSearch extends Model<
  InferAttributes<CandidateSearch>,
  InferCreationAttributes<CandidateSearch>
> {
  declare id: CreationOptional<string>;
  declare natural_language_query: string;
  declare structured_query: CreationOptional<Record<string, unknown>>;
  declare company_id: CreationOptional<string | null>;
  declare drive_id: CreationOptional<string | null>;
  declare recruiter_id: CreationOptional<string | null>;
  declare requested_by: ForeignKey<string>;
  declare result_count: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;
}

export class CandidateMatchRun extends Model<
  InferAttributes<CandidateMatchRun>,
  InferCreationAttributes<CandidateMatchRun>
> {
  declare id: CreationOptional<string>;
  declare candidate_search_id: CreationOptional<ForeignKey<CandidateSearch["id"]> | null>;
  declare ai_run_id: ForeignKey<AiRun["id"]>;
  declare drive_id: CreationOptional<string | null>;
  declare job_description_version_id: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare configuration: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare completed_at: CreationOptional<Date | null>;
}

export class CandidateMatchResult extends Model<
  InferAttributes<CandidateMatchResult>,
  InferCreationAttributes<CandidateMatchResult>
> {
  declare id: CreationOptional<string>;
  declare match_run_id: ForeignKey<CandidateMatchRun["id"]>;
  declare student_id: ForeignKey<string>;
  declare resume_version_id: CreationOptional<string | null>;
  declare rank: number;
  declare match_score: number;
  declare reasons: CreationOptional<unknown[]>;
  declare score_breakdown: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class SkillGapAnalysis extends Model<
  InferAttributes<SkillGapAnalysis>,
  InferCreationAttributes<SkillGapAnalysis>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<string>;
  declare target_role: string;
  declare job_opportunity_id: CreationOptional<string | null>;
  declare resume_version_id: CreationOptional<string | null>;
  declare ai_run_id: ForeignKey<AiRun["id"]>;
  declare summary: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class SkillGapItem extends Model<
  InferAttributes<SkillGapItem>,
  InferCreationAttributes<SkillGapItem>
> {
  declare id: CreationOptional<string>;
  declare skill_gap_analysis_id: ForeignKey<SkillGapAnalysis["id"]>;
  declare skill_id: CreationOptional<string | null>;
  declare skill_name: string;
  declare status: string;
  declare current_level: CreationOptional<string | null>;
  declare target_level: CreationOptional<string | null>;
  declare priority: CreationOptional<number>;
  declare evidence: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class MarketSkillSnapshot extends Model<
  InferAttributes<MarketSkillSnapshot>,
  InferCreationAttributes<MarketSkillSnapshot>
> {
  declare id: CreationOptional<string>;
  declare skill_id: CreationOptional<string | null>;
  declare skill_name: string;
  declare market: string;
  declare demand_score: number;
  declare growth_score: CreationOptional<number | null>;
  declare source: string;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare captured_at: Date;
  declare created_at: CreationOptional<Date>;
}

export class AiUsageQuota extends Model<
  InferAttributes<AiUsageQuota>,
  InferCreationAttributes<AiUsageQuota>
> {
  declare id: CreationOptional<string>;
  declare scope_type: string;
  declare scope_id: string;
  declare credit_limit: number;
  declare used_credits: CreationOptional<number>;
  declare reset_frequency: CreationOptional<string>;
  declare last_reset_at: CreationOptional<Date | null>;
  declare is_active: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare credit_events?: NonAttribute<AiCreditEvent[]>;
}

export class AiCreditEvent extends Model<
  InferAttributes<AiCreditEvent>,
  InferCreationAttributes<AiCreditEvent>
> {
  declare id: CreationOptional<string>;
  declare quota_id: ForeignKey<AiUsageQuota["id"]>;
  declare user_id: ForeignKey<User["id"]>;
  declare ai_run_id: CreationOptional<ForeignKey<AiRun["id"]> | null>;
  declare feature: string;
  declare credits_consumed: number;
  declare input_tokens: CreationOptional<number>;
  declare output_tokens: CreationOptional<number>;
  declare created_at: CreationOptional<Date>;

  declare quota?: NonAttribute<AiUsageQuota>;
  declare user?: NonAttribute<User>;
  declare ai_run?: NonAttribute<AiRun>;
}

AiRun.init(
  {
    id: idAttribute,
    run_type: { type: DataTypes.STRING(64), allowNull: false },
    model_name: { type: DataTypes.STRING(120), allowNull: false },
    model_version: { type: DataTypes.STRING(120), allowNull: false },
    input_snapshot_hash: { type: DataTypes.STRING(128), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "QUEUED" },
    prompt_tokens: { type: DataTypes.INTEGER, allowNull: true },
    completion_tokens: { type: DataTypes.INTEGER, allowNull: true },
    estimated_cost: { type: DataTypes.DECIMAL(14, 6), allowNull: true },
    error_details: { type: DataTypes.JSONB, allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    completed_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "ai_runs", "AiRun", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["run_type", "status"] }, { fields: ["created_at"] }],
  })
);

AiUsageRecord.init(
  {
    id: idAttribute,
    request_id: { type: DataTypes.UUID, allowNull: false, unique: true },
    client_id: { type: DataTypes.STRING(128), allowNull: false },
    application_id: { type: DataTypes.STRING(256), allowNull: true },
    signature_type: { type: DataTypes.STRING(128), allowNull: false },
    provider: { type: DataTypes.STRING(64), allowNull: false },
    model_name: { type: DataTypes.STRING(256), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false },
    input_tokens: { type: DataTypes.INTEGER, allowNull: true },
    output_tokens: { type: DataTypes.INTEGER, allowNull: true },
    total_tokens: { type: DataTypes.INTEGER, allowNull: true },
    latency_ms: { type: DataTypes.INTEGER, allowNull: false },
    metadata: jsonObjectAttribute,
    error_code: { type: DataTypes.STRING(128), allowNull: true },
    error_message: { type: DataTypes.TEXT, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "ai_usage_records", "AiUsageRecord", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["request_id"] },
      { fields: ["client_id", "created_at"] },
      { fields: ["signature_type", "created_at"] },
      { fields: ["status", "created_at"] },
    ],
  })
);

ResumeAnalysis.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    resume_version_id: requiredUuid("resume_versions", "RESTRICT"),
    job_opportunity_id: optionalUuid("job_opportunities"),
    job_description_version_id: optionalUuid("job_description_versions"),
    ai_run_id: requiredUuid("ai_runs", "RESTRICT"),
    match_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    keyword_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    experience_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    skills_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    education_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    missing_keywords: jsonArrayAttribute,
    recommendations: jsonArrayAttribute,
    analysis_data: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "resume_analyses", "ResumeAnalysis", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["student_id"] },
      { fields: ["resume_version_id"] },
      { fields: ["job_description_version_id"] },
      { fields: ["ai_run_id"] },
    ],
  })
);

CandidateSearch.init(
  {
    id: idAttribute,
    natural_language_query: { type: DataTypes.TEXT, allowNull: false },
    structured_query: jsonObjectAttribute,
    company_id: optionalUuid("companies"),
    drive_id: optionalUuid("placement_drives"),
    recruiter_id: optionalUuid("recruiter_profiles"),
    requested_by: requiredUuid("users", "CASCADE"),
    result_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "candidate_searches", "CandidateSearch", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["requested_by", "created_at"] }, { fields: ["drive_id"] }],
  })
);

CandidateMatchRun.init(
  {
    id: idAttribute,
    candidate_search_id: optionalUuid("candidate_searches"),
    ai_run_id: requiredUuid("ai_runs", "RESTRICT"),
    drive_id: optionalUuid("placement_drives"),
    job_description_version_id: optionalUuid("job_description_versions"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "QUEUED" },
    configuration: jsonObjectAttribute,
    created_at: createdAtAttribute,
    completed_at: { type: DataTypes.DATE, allowNull: true },
  },
  modelOptions(sequelize, "candidate_match_runs", "CandidateMatchRun", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["candidate_search_id"] }, { fields: ["drive_id", "status"] }],
  })
);

CandidateMatchResult.init(
  {
    id: idAttribute,
    match_run_id: requiredUuid("candidate_match_runs", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    resume_version_id: optionalUuid("resume_versions"),
    rank: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    match_score: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
    reasons: jsonArrayAttribute,
    score_breakdown: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "candidate_match_results", "CandidateMatchResult", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["match_run_id", "student_id"] },
      { unique: true, fields: ["match_run_id", "rank"] },
    ],
  })
);

SkillGapAnalysis.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    target_role: { type: DataTypes.STRING, allowNull: false },
    job_opportunity_id: optionalUuid("job_opportunities"),
    resume_version_id: optionalUuid("resume_versions"),
    ai_run_id: requiredUuid("ai_runs", "RESTRICT"),
    summary: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "skill_gap_analyses", "SkillGapAnalysis", {
    indexes: [{ fields: ["student_id", "created_at"] }, { fields: ["ai_run_id"] }],
  })
);

SkillGapItem.init(
  {
    id: idAttribute,
    skill_gap_analysis_id: requiredUuid("skill_gap_analyses", "CASCADE"),
    skill_id: optionalUuid("skills"),
    skill_name: { type: DataTypes.STRING(120), allowNull: false },
    status: { type: DataTypes.STRING(32), allowNull: false },
    current_level: { type: DataTypes.STRING(32), allowNull: true },
    target_level: { type: DataTypes.STRING(32), allowNull: true },
    priority: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 0 },
    evidence: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "skill_gap_items", "SkillGapItem", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["skill_gap_analysis_id", "priority"] }, { fields: ["skill_id"] }],
  })
);

MarketSkillSnapshot.init(
  {
    id: idAttribute,
    skill_id: optionalUuid("skills"),
    skill_name: { type: DataTypes.STRING(120), allowNull: false },
    market: { type: DataTypes.STRING(120), allowNull: false },
    demand_score: { type: DataTypes.DECIMAL(7, 4), allowNull: false },
    growth_score: { type: DataTypes.DECIMAL(7, 4), allowNull: true },
    source: { type: DataTypes.STRING(120), allowNull: false },
    metadata: jsonObjectAttribute,
    captured_at: { type: DataTypes.DATE, allowNull: false },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "market_skill_snapshots", "MarketSkillSnapshot", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["skill_id", "market", "captured_at"] }, { fields: ["skill_name"] }],
  })
);

AiRun.hasMany(ResumeAnalysis, { foreignKey: "ai_run_id", as: "resume_analyses" });
CandidateSearch.hasMany(CandidateMatchRun, { foreignKey: "candidate_search_id", as: "match_runs" });
CandidateMatchRun.hasMany(CandidateMatchResult, { foreignKey: "match_run_id", as: "results" });
SkillGapAnalysis.hasMany(SkillGapItem, { foreignKey: "skill_gap_analysis_id", as: "items" });

AiUsageQuota.init(
  {
    id: idAttribute,
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: { type: DataTypes.STRING(128), allowNull: false },
    credit_limit: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0 } },
    used_credits: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    reset_frequency: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "MONTHLY" },
    last_reset_at: { type: DataTypes.DATE, allowNull: true },
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "ai_usage_quotas", "AiUsageQuota", {
    indexes: [
      { unique: true, fields: ["scope_type", "scope_id"] },
      { fields: ["is_active"] },
    ],
  })
);

AiCreditEvent.init(
  {
    id: idAttribute,
    quota_id: requiredUuid("ai_usage_quotas", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    ai_run_id: optionalUuid("ai_runs", "SET NULL"),
    feature: { type: DataTypes.STRING(64), allowNull: false },
    credits_consumed: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    input_tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    output_tokens: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "ai_credit_events", "AiCreditEvent", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["quota_id"] },
      { fields: ["user_id"] },
      { fields: ["ai_run_id"] },
      { fields: ["created_at"] },
    ],
  })
);

AiUsageQuota.hasMany(AiCreditEvent, { foreignKey: "quota_id", as: "credit_events" });
AiCreditEvent.belongsTo(AiUsageQuota, { foreignKey: "quota_id", as: "quota" });

export default {
  AiRun,
  AiUsageRecord,
  ResumeAnalysis,
  CandidateSearch,
  CandidateMatchRun,
  CandidateMatchResult,
  SkillGapAnalysis,
  SkillGapItem,
  MarketSkillSnapshot,
  AiUsageQuota,
  AiCreditEvent,
};
