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
import type { User } from "../../user/user.model";

export class Company extends Model<InferAttributes<Company>, InferCreationAttributes<Company>> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare legal_name: CreationOptional<string | null>;
  declare website_url: CreationOptional<string | null>;
  declare industry: CreationOptional<string | null>;
  declare description: CreationOptional<string | null>;
  declare headquarters: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class CompanyContact extends Model<
  InferAttributes<CompanyContact>,
  InferCreationAttributes<CompanyContact>
> {
  declare id: CreationOptional<string>;
  declare company_id: ForeignKey<Company["id"]>;
  declare name: string;
  declare email: CreationOptional<string | null>;
  declare phone: CreationOptional<string | null>;
  declare designation: CreationOptional<string | null>;
  declare is_primary: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class RecruiterProfile extends Model<
  InferAttributes<RecruiterProfile>,
  InferCreationAttributes<RecruiterProfile>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare company_id: ForeignKey<Company["id"]>;
  declare designation: CreationOptional<string | null>;
  declare verification_status: CreationOptional<string>;
  declare verified_by: CreationOptional<string | null>;
  declare verified_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class CrmPipeline extends Model<
  InferAttributes<CrmPipeline>,
  InferCreationAttributes<CrmPipeline>
> {
  declare id: CreationOptional<string>;
  declare company_id: ForeignKey<Company["id"]>;
  declare stage: CreationOptional<string>;
  declare owner_user_id: CreationOptional<string | null>;
  declare notes: CreationOptional<string | null>;
  declare next_follow_up_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class CrmActivity extends Model<
  InferAttributes<CrmActivity>,
  InferCreationAttributes<CrmActivity>
> {
  declare id: CreationOptional<string>;
  declare pipeline_id: ForeignKey<CrmPipeline["id"]>;
  declare company_id: ForeignKey<Company["id"]>;
  declare actor_user_id: CreationOptional<string | null>;
  declare department_id: CreationOptional<string | null>;
  declare activity_type: string;
  declare subject: CreationOptional<string | null>;
  declare details: CreationOptional<string | null>;
  declare occurred_at: Date;
  declare created_at: CreationOptional<Date>;
}

export class RecruitmentVisit extends Model<
  InferAttributes<RecruitmentVisit>,
  InferCreationAttributes<RecruitmentVisit>
> {
  declare id: CreationOptional<string>;
  declare company_id: ForeignKey<Company["id"]>;
  declare title: string;
  declare visit_at: Date;
  declare location: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare notes: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

Company.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING, allowNull: false },
    legal_name: { type: DataTypes.STRING, allowNull: true },
    website_url: { type: DataTypes.STRING(2048), allowNull: true, validate: { isUrl: true } },
    industry: { type: DataTypes.STRING(120), allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    headquarters: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "companies", "Company", {
    indexes: [{ fields: ["name"] }, { fields: ["industry"] }],
  })
);

CompanyContact.init(
  {
    id: idAttribute,
    company_id: requiredUuid("companies", "CASCADE"),
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: true, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING(32), allowNull: true },
    designation: { type: DataTypes.STRING(120), allowNull: true },
    is_primary: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "company_contacts", "CompanyContact", {
    indexes: [{ fields: ["company_id"] }, { fields: ["email"] }],
  })
);

RecruiterProfile.init(
  {
    id: idAttribute,
    user_id: { ...requiredUuid("users", "CASCADE"), unique: true },
    company_id: requiredUuid("companies", "RESTRICT"),
    designation: { type: DataTypes.STRING(120), allowNull: true },
    verification_status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    verified_by: optionalUuid("users"),
    verified_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "recruiter_profiles", "RecruiterProfile", {
    indexes: [{ fields: ["company_id"] }, { fields: ["verification_status"] }],
  })
);

CrmPipeline.init(
  {
    id: idAttribute,
    company_id: { ...requiredUuid("companies", "CASCADE"), unique: true },
    stage: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PROSPECT" },
    owner_user_id: optionalUuid("users"),
    notes: { type: DataTypes.TEXT, allowNull: true },
    next_follow_up_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "crm_pipelines", "CrmPipeline", {
    indexes: [{ fields: ["stage"] }, { fields: ["owner_user_id"] }],
  })
);

CrmActivity.init(
  {
    id: idAttribute,
    pipeline_id: requiredUuid("crm_pipelines", "CASCADE"),
    company_id: requiredUuid("companies", "CASCADE"),
    actor_user_id: optionalUuid("users"),
    department_id: optionalUuid("departments"),
    activity_type: { type: DataTypes.STRING(32), allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: true },
    details: { type: DataTypes.TEXT, allowNull: true },
    occurred_at: { type: DataTypes.DATE, allowNull: false },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "crm_activities", "CrmActivity", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["pipeline_id", "occurred_at"] }, { fields: ["department_id"] }],
  })
);

RecruitmentVisit.init(
  {
    id: idAttribute,
    company_id: requiredUuid("companies", "CASCADE"),
    title: { type: DataTypes.STRING, allowNull: false },
    visit_at: { type: DataTypes.DATE, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "SCHEDULED" },
    notes: { type: DataTypes.TEXT, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "recruitment_visits", "RecruitmentVisit", {
    indexes: [{ fields: ["company_id", "visit_at"] }],
  })
);

Company.hasMany(CompanyContact, { foreignKey: "company_id", as: "contacts" });
CompanyContact.belongsTo(Company, { foreignKey: "company_id", as: "company" });
Company.hasMany(RecruiterProfile, { foreignKey: "company_id", as: "recruiters" });
RecruiterProfile.belongsTo(Company, { foreignKey: "company_id", as: "company" });
Company.hasOne(CrmPipeline, { foreignKey: "company_id", as: "pipeline" });
CrmPipeline.belongsTo(Company, { foreignKey: "company_id", as: "company" });
CrmPipeline.hasMany(CrmActivity, { foreignKey: "pipeline_id", as: "activities" });
CrmActivity.belongsTo(CrmPipeline, { foreignKey: "pipeline_id", as: "pipeline" });

export default {
  Company,
  CompanyContact,
  RecruiterProfile,
  CrmPipeline,
  CrmActivity,
  RecruitmentVisit,
};
