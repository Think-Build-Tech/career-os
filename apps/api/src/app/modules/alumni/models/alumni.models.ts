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
import type { StudentProfile } from "../../student/models/student.model";
import type { User } from "../../user/user.model";

export class AlumniProfile extends Model<
  InferAttributes<AlumniProfile>,
  InferCreationAttributes<AlumniProfile>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare former_student_id: CreationOptional<ForeignKey<StudentProfile["id"]> | null>;
  declare graduation_year: CreationOptional<number | null>;
  declare headline: CreationOptional<string | null>;
  declare bio: CreationOptional<string | null>;
  declare referrals_enabled: CreationOptional<boolean>;
  declare mentoring_enabled: CreationOptional<boolean>;
  declare student_chat_enabled: CreationOptional<boolean>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AlumniEmployment extends Model<
  InferAttributes<AlumniEmployment>,
  InferCreationAttributes<AlumniEmployment>
> {
  declare id: CreationOptional<string>;
  declare alumni_id: ForeignKey<AlumniProfile["id"]>;
  declare company_name: string;
  declare role_title: string;
  declare location: CreationOptional<string | null>;
  declare start_date: Date;
  declare end_date: CreationOptional<Date | null>;
  declare is_current: CreationOptional<boolean>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ReferralPost extends Model<
  InferAttributes<ReferralPost>,
  InferCreationAttributes<ReferralPost>
> {
  declare id: CreationOptional<string>;
  declare alumni_id: ForeignKey<AlumniProfile["id"]>;
  declare company_id: CreationOptional<string | null>;
  declare title: string;
  declare description: string;
  declare eligibility: CreationOptional<Record<string, unknown>>;
  declare status: CreationOptional<string>;
  declare closes_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ReferralRequest extends Model<
  InferAttributes<ReferralRequest>,
  InferCreationAttributes<ReferralRequest>
> {
  declare id: CreationOptional<string>;
  declare referral_post_id: ForeignKey<ReferralPost["id"]>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare resume_version_id: ForeignKey<string>;
  declare message: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare responded_at: CreationOptional<Date | null>;
  declare outcome: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AlumniConnectionRequest extends Model<
  InferAttributes<AlumniConnectionRequest>,
  InferCreationAttributes<AlumniConnectionRequest>
> {
  declare id: CreationOptional<string>;
  declare alumni_id: ForeignKey<AlumniProfile["id"]>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare request_type: string;
  declare message: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare responded_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class MentorshipAvailabilitySlot extends Model<
  InferAttributes<MentorshipAvailabilitySlot>,
  InferCreationAttributes<MentorshipAvailabilitySlot>
> {
  declare id: CreationOptional<string>;
  declare alumni_id: ForeignKey<AlumniProfile["id"]>;
  declare topic: string;
  declare starts_at: Date;
  declare ends_at: Date;
  declare duration_minutes: CreationOptional<number>;
  declare meeting_link: CreationOptional<string | null>;
  declare is_booked: CreationOptional<boolean>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare alumni?: NonAttribute<AlumniProfile>;
  declare bookings?: NonAttribute<MentorshipBooking[]>;
}

export class MentorshipBooking extends Model<
  InferAttributes<MentorshipBooking>,
  InferCreationAttributes<MentorshipBooking>
> {
  declare id: CreationOptional<string>;
  declare slot_id: ForeignKey<MentorshipAvailabilitySlot["id"]>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare alumni_id: ForeignKey<AlumniProfile["id"]>;
  declare status: CreationOptional<string>;
  declare notes: CreationOptional<string | null>;
  declare student_feedback: CreationOptional<string | null>;
  declare alumni_feedback: CreationOptional<string | null>;
  declare booked_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare slot?: NonAttribute<MentorshipAvailabilitySlot>;
  declare student?: NonAttribute<StudentProfile>;
  declare alumni?: NonAttribute<AlumniProfile>;
}

AlumniProfile.init(
  {
    id: idAttribute,
    user_id: { ...requiredUuid("users", "CASCADE"), unique: true },
    former_student_id: { ...optionalUuid("student_profiles"), unique: true },
    graduation_year: { type: DataTypes.SMALLINT, allowNull: true },
    headline: { type: DataTypes.STRING(200), allowNull: true },
    bio: { type: DataTypes.TEXT, allowNull: true },
    referrals_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    mentoring_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    student_chat_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "alumni_profiles", "AlumniProfile", {
    indexes: [{ fields: ["graduation_year"] }],
  })
);

AlumniEmployment.init(
  {
    id: idAttribute,
    alumni_id: requiredUuid("alumni_profiles", "CASCADE"),
    company_name: { type: DataTypes.STRING, allowNull: false },
    role_title: { type: DataTypes.STRING, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    is_current: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "alumni_employments", "AlumniEmployment", {
    indexes: [{ fields: ["alumni_id"] }, { fields: ["company_name"] }],
  })
);

ReferralPost.init(
  {
    id: idAttribute,
    alumni_id: requiredUuid("alumni_profiles", "CASCADE"),
    company_id: optionalUuid("companies"),
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    eligibility: jsonObjectAttribute,
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    closes_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "referral_posts", "ReferralPost", {
    indexes: [{ fields: ["alumni_id"] }, { fields: ["status", "closes_at"] }],
  })
);

ReferralRequest.init(
  {
    id: idAttribute,
    referral_post_id: requiredUuid("referral_posts", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    resume_version_id: requiredUuid("resume_versions", "RESTRICT"),
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    responded_at: { type: DataTypes.DATE, allowNull: true },
    outcome: { type: DataTypes.STRING(32), allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "referral_requests", "ReferralRequest", {
    indexes: [
      { unique: true, fields: ["referral_post_id", "student_id"] },
      { fields: ["student_id", "status"] },
    ],
  })
);

AlumniConnectionRequest.init(
  {
    id: idAttribute,
    alumni_id: requiredUuid("alumni_profiles", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    request_type: { type: DataTypes.STRING(32), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "PENDING" },
    responded_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "alumni_connection_requests", "AlumniConnectionRequest", {
    indexes: [
      { unique: true, fields: ["alumni_id", "student_id", "request_type", "status"] },
      { fields: ["student_id", "status"] },
    ],
  })
);

AlumniProfile.hasMany(AlumniEmployment, { foreignKey: "alumni_id", as: "employment_history" });
AlumniEmployment.belongsTo(AlumniProfile, { foreignKey: "alumni_id", as: "alumni" });
AlumniProfile.hasMany(ReferralPost, { foreignKey: "alumni_id", as: "referral_posts" });
ReferralPost.hasMany(ReferralRequest, { foreignKey: "referral_post_id", as: "requests" });

MentorshipAvailabilitySlot.init(
  {
    id: idAttribute,
    alumni_id: requiredUuid("alumni_profiles", "CASCADE"),
    topic: { type: DataTypes.STRING(64), allowNull: false },
    starts_at: { type: DataTypes.DATE, allowNull: false },
    ends_at: { type: DataTypes.DATE, allowNull: false },
    duration_minutes: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 30 },
    meeting_link: { type: DataTypes.STRING(2048), allowNull: true },
    is_booked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "AVAILABLE" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "mentorship_availability_slots", "MentorshipAvailabilitySlot", {
    indexes: [
      { fields: ["alumni_id"] },
      { fields: ["starts_at", "ends_at"] },
      { fields: ["status"] },
      { fields: ["is_booked"] },
    ],
  })
);

MentorshipBooking.init(
  {
    id: idAttribute,
    slot_id: requiredUuid("mentorship_availability_slots", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    alumni_id: requiredUuid("alumni_profiles", "CASCADE"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "SCHEDULED" },
    notes: { type: DataTypes.TEXT, allowNull: true },
    student_feedback: { type: DataTypes.TEXT, allowNull: true },
    alumni_feedback: { type: DataTypes.TEXT, allowNull: true },
    booked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "mentorship_bookings", "MentorshipBooking", {
    indexes: [
      { unique: true, fields: ["slot_id"] },
      { fields: ["student_id"] },
      { fields: ["alumni_id"] },
      { fields: ["status"] },
    ],
  })
);

AlumniProfile.hasMany(MentorshipAvailabilitySlot, { foreignKey: "alumni_id", as: "mentorship_slots" });
MentorshipAvailabilitySlot.belongsTo(AlumniProfile, { foreignKey: "alumni_id", as: "alumni" });

MentorshipAvailabilitySlot.hasOne(MentorshipBooking, { foreignKey: "slot_id", as: "booking" });
MentorshipBooking.belongsTo(MentorshipAvailabilitySlot, { foreignKey: "slot_id", as: "slot" });

MentorshipBooking.belongsTo(AlumniProfile, { foreignKey: "alumni_id", as: "alumni" });

export default {
  AlumniProfile,
  AlumniEmployment,
  ReferralPost,
  ReferralRequest,
  AlumniConnectionRequest,
  MentorshipAvailabilitySlot,
  MentorshipBooking,
};
