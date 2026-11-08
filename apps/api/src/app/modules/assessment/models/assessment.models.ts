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

export class Assessment extends Model<
  InferAttributes<Assessment>,
  InferCreationAttributes<Assessment>
> {
  declare id: CreationOptional<string>;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare assessment_type: string;
  declare scope_type: string;
  declare scope_id: CreationOptional<string | null>;
  declare duration_minutes: CreationOptional<number | null>;
  declare maximum_score: number;
  declare passing_score: CreationOptional<number | null>;
  declare settings: CreationOptional<Record<string, unknown>>;
  declare status: CreationOptional<string>;
  declare created_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AssessmentQuestion extends Model<
  InferAttributes<AssessmentQuestion>,
  InferCreationAttributes<AssessmentQuestion>
> {
  declare id: CreationOptional<string>;
  declare assessment_id: ForeignKey<Assessment["id"]>;
  declare question_type: string;
  declare prompt: string;
  declare options: CreationOptional<unknown[]>;
  declare correct_answer: CreationOptional<Record<string, unknown> | null>;
  declare points: number;
  declare sequence_number: number;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AssessmentAssignment extends Model<
  InferAttributes<AssessmentAssignment>,
  InferCreationAttributes<AssessmentAssignment>
> {
  declare id: CreationOptional<string>;
  declare assessment_id: ForeignKey<Assessment["id"]>;
  declare scope_type: string;
  declare scope_id: string;
  declare available_from: CreationOptional<Date | null>;
  declare due_at: CreationOptional<Date | null>;
  declare max_attempts: CreationOptional<number>;
  declare created_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AssessmentAttempt extends Model<
  InferAttributes<AssessmentAttempt>,
  InferCreationAttributes<AssessmentAttempt>
> {
  declare id: CreationOptional<string>;
  declare assessment_id: ForeignKey<Assessment["id"]>;
  declare assignment_id: CreationOptional<ForeignKey<AssessmentAssignment["id"]> | null>;
  declare student_id: ForeignKey<string>;
  declare attempt_number: number;
  declare status: CreationOptional<string>;
  declare score: CreationOptional<number | null>;
  declare started_at: CreationOptional<Date>;
  declare submitted_at: CreationOptional<Date | null>;
  declare graded_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class AssessmentResponse extends Model<
  InferAttributes<AssessmentResponse>,
  InferCreationAttributes<AssessmentResponse>
> {
  declare id: CreationOptional<string>;
  declare attempt_id: ForeignKey<AssessmentAttempt["id"]>;
  declare question_id: ForeignKey<AssessmentQuestion["id"]>;
  declare response: Record<string, unknown>;
  declare is_correct: CreationOptional<boolean | null>;
  declare awarded_points: CreationOptional<number | null>;
  declare graded_by: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ProctorSession extends Model<
  InferAttributes<ProctorSession>,
  InferCreationAttributes<ProctorSession>
> {
  declare id: CreationOptional<string>;
  declare attempt_id: ForeignKey<AssessmentAttempt["id"]>;
  declare status: CreationOptional<string>;
  declare risk_score: CreationOptional<number | null>;
  declare started_at: CreationOptional<Date>;
  declare ended_at: CreationOptional<Date | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ProctorEvent extends Model<
  InferAttributes<ProctorEvent>,
  InferCreationAttributes<ProctorEvent>
> {
  declare id: CreationOptional<string>;
  declare proctor_session_id: ForeignKey<ProctorSession["id"]>;
  declare event_type: string;
  declare severity: CreationOptional<string>;
  declare evidence_object_key: CreationOptional<string | null>;
  declare event_data: CreationOptional<Record<string, unknown>>;
  declare occurred_at: Date;
  declare created_at: CreationOptional<Date>;
}

export class BadgeDefinition extends Model<
  InferAttributes<BadgeDefinition>,
  InferCreationAttributes<BadgeDefinition>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare code: string;
  declare description: CreationOptional<string | null>;
  declare badge_type: string;
  declare criteria: CreationOptional<Record<string, unknown>>;
  declare image_object_key: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class StudentBadge extends Model<
  InferAttributes<StudentBadge>,
  InferCreationAttributes<StudentBadge>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<string>;
  declare badge_definition_id: ForeignKey<BadgeDefinition["id"]>;
  declare assessment_attempt_id: CreationOptional<string | null>;
  declare evidence_type: CreationOptional<string | null>;
  declare evidence_id: CreationOptional<string | null>;
  declare issued_by: CreationOptional<string | null>;
  declare issued_at: CreationOptional<Date>;
  declare expires_at: CreationOptional<Date | null>;
  declare revoked_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
}

export class AssessmentSlot extends Model<
  InferAttributes<AssessmentSlot>,
  InferCreationAttributes<AssessmentSlot>
> {
  declare id: CreationOptional<string>;
  declare assessment_id: ForeignKey<Assessment["id"]>;
  declare starts_at: Date;
  declare ends_at: Date;
  declare capacity: number;
  declare booked_count: CreationOptional<number>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare assessment?: NonAttribute<Assessment>;
  declare bookings?: NonAttribute<AssessmentSlotBooking[]>;
}

export class AssessmentSlotBooking extends Model<
  InferAttributes<AssessmentSlotBooking>,
  InferCreationAttributes<AssessmentSlotBooking>
> {
  declare id: CreationOptional<string>;
  declare slot_id: ForeignKey<AssessmentSlot["id"]>;
  declare student_id: ForeignKey<string>;
  declare status: CreationOptional<string>;
  declare booked_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare slot?: NonAttribute<AssessmentSlot>;
}

export class ProctorPreflight extends Model<
  InferAttributes<ProctorPreflight>,
  InferCreationAttributes<ProctorPreflight>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<string>;
  declare assessment_id: ForeignKey<Assessment["id"]>;
  declare camera_passed: CreationOptional<boolean>;
  declare microphone_passed: CreationOptional<boolean>;
  declare network_passed: CreationOptional<boolean>;
  declare browser_passed: CreationOptional<boolean>;
  declare display_passed: CreationOptional<boolean>;
  declare identity_verified: CreationOptional<boolean>;
  declare system_info: CreationOptional<Record<string, unknown>>;
  declare completed_at: CreationOptional<Date>;
  declare created_at: CreationOptional<Date>;

  declare assessment?: NonAttribute<Assessment>;
}

Assessment.init(
  {
    id: idAttribute,
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    assessment_type: { type: DataTypes.STRING(40), allowNull: false },
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: optionalUuid(),
    duration_minutes: { type: DataTypes.INTEGER, allowNull: true },
    maximum_score: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    passing_score: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
    settings: jsonObjectAttribute,
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    created_by: optionalUuid("users"),
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessments", "Assessment", {
    indexes: [{ fields: ["scope_type", "scope_id"] }, { fields: ["status"] }],
  })
);

AssessmentQuestion.init(
  {
    id: idAttribute,
    assessment_id: requiredUuid("assessments", "CASCADE"),
    question_type: { type: DataTypes.STRING(40), allowNull: false },
    prompt: { type: DataTypes.TEXT, allowNull: false },
    options: jsonArrayAttribute,
    correct_answer: { type: DataTypes.JSONB, allowNull: true },
    points: { type: DataTypes.DECIMAL(8, 2), allowNull: false },
    sequence_number: { type: DataTypes.INTEGER, allowNull: false },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_questions", "AssessmentQuestion", {
    indexes: [{ unique: true, fields: ["assessment_id", "sequence_number"] }],
  })
);

AssessmentAssignment.init(
  {
    id: idAttribute,
    assessment_id: requiredUuid("assessments", "CASCADE"),
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: { type: DataTypes.UUID, allowNull: false },
    available_from: { type: DataTypes.DATE, allowNull: true },
    due_at: { type: DataTypes.DATE, allowNull: true },
    max_attempts: { type: DataTypes.SMALLINT, allowNull: false, defaultValue: 1 },
    created_by: optionalUuid("users"),
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_assignments", "AssessmentAssignment", {
    indexes: [
      { unique: true, fields: ["assessment_id", "scope_type", "scope_id"] },
      { fields: ["scope_type", "scope_id"] },
    ],
  })
);

AssessmentAttempt.init(
  {
    id: idAttribute,
    assessment_id: requiredUuid("assessments", "RESTRICT"),
    assignment_id: optionalUuid("assessment_assignments"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    attempt_number: { type: DataTypes.SMALLINT, allowNull: false, validate: { min: 1 } },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "IN_PROGRESS" },
    score: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    submitted_at: { type: DataTypes.DATE, allowNull: true },
    graded_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_attempts", "AssessmentAttempt", {
    indexes: [
      { unique: true, fields: ["assessment_id", "student_id", "attempt_number"] },
      { fields: ["student_id"] },
      { fields: ["status"] },
    ],
  })
);

AssessmentResponse.init(
  {
    id: idAttribute,
    attempt_id: requiredUuid("assessment_attempts", "CASCADE"),
    question_id: requiredUuid("assessment_questions", "RESTRICT"),
    response: { type: DataTypes.JSONB, allowNull: false },
    is_correct: { type: DataTypes.BOOLEAN, allowNull: true },
    awarded_points: { type: DataTypes.DECIMAL(8, 2), allowNull: true },
    graded_by: optionalUuid("users"),
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_responses", "AssessmentResponse", {
    indexes: [{ unique: true, fields: ["attempt_id", "question_id"] }],
  })
);

ProctorSession.init(
  {
    id: idAttribute,
    attempt_id: { ...requiredUuid("assessment_attempts", "CASCADE"), unique: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    risk_score: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    started_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    ended_at: { type: DataTypes.DATE, allowNull: true },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "proctor_sessions", "ProctorSession")
);

ProctorEvent.init(
  {
    id: idAttribute,
    proctor_session_id: requiredUuid("proctor_sessions", "CASCADE"),
    event_type: { type: DataTypes.STRING(64), allowNull: false },
    severity: { type: DataTypes.STRING(16), allowNull: false, defaultValue: "LOW" },
    evidence_object_key: { type: DataTypes.STRING(2048), allowNull: true },
    event_data: jsonObjectAttribute,
    occurred_at: { type: DataTypes.DATE, allowNull: false },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "proctor_events", "ProctorEvent", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["proctor_session_id", "occurred_at"] }, { fields: ["event_type"] }],
  })
);

BadgeDefinition.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(64), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    badge_type: { type: DataTypes.STRING(40), allowNull: false },
    criteria: jsonObjectAttribute,
    image_object_key: { type: DataTypes.STRING(2048), allowNull: true },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "badge_definitions", "BadgeDefinition")
);

StudentBadge.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    badge_definition_id: requiredUuid("badge_definitions", "RESTRICT"),
    assessment_attempt_id: optionalUuid("assessment_attempts"),
    evidence_type: { type: DataTypes.STRING(40), allowNull: true },
    evidence_id: optionalUuid(),
    issued_by: optionalUuid("users"),
    issued_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    expires_at: { type: DataTypes.DATE, allowNull: true },
    revoked_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "student_badges", "StudentBadge", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["student_id"] },
      { fields: ["badge_definition_id"] },
      { fields: ["assessment_attempt_id"] },
    ],
  })
);

Assessment.hasMany(AssessmentQuestion, { foreignKey: "assessment_id", as: "questions" });
Assessment.hasMany(AssessmentAssignment, { foreignKey: "assessment_id", as: "assignments" });
Assessment.hasMany(AssessmentAttempt, { foreignKey: "assessment_id", as: "attempts" });
AssessmentAttempt.hasMany(AssessmentResponse, { foreignKey: "attempt_id", as: "responses" });
AssessmentAttempt.hasOne(ProctorSession, { foreignKey: "attempt_id", as: "proctor_session" });
ProctorSession.hasMany(ProctorEvent, { foreignKey: "proctor_session_id", as: "events" });
BadgeDefinition.hasMany(StudentBadge, { foreignKey: "badge_definition_id", as: "awards" });

AssessmentSlot.init(
  {
    id: idAttribute,
    assessment_id: requiredUuid("assessments", "CASCADE"),
    starts_at: { type: DataTypes.DATE, allowNull: false },
    ends_at: { type: DataTypes.DATE, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1 } },
    booked_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, validate: { min: 0 } },
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "OPEN" },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_slots", "AssessmentSlot", {
    indexes: [
      { fields: ["assessment_id"] },
      { fields: ["starts_at", "ends_at"] },
      { fields: ["status"] },
    ],
  })
);

AssessmentSlotBooking.init(
  {
    id: idAttribute,
    slot_id: requiredUuid("assessment_slots", "CASCADE"),
    student_id: requiredUuid("student_profiles", "CASCADE"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "CONFIRMED" },
    booked_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "assessment_slot_bookings", "AssessmentSlotBooking", {
    indexes: [
      { unique: true, fields: ["slot_id", "student_id"] },
      { fields: ["student_id"] },
      { fields: ["status"] },
    ],
  })
);

ProctorPreflight.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    assessment_id: requiredUuid("assessments", "CASCADE"),
    camera_passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    microphone_passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    network_passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    browser_passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    display_passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    identity_verified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    system_info: jsonObjectAttribute,
    completed_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "proctor_preflights", "ProctorPreflight", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["student_id"] },
      { fields: ["assessment_id"] },
      { fields: ["completed_at"] },
    ],
  })
);

Assessment.hasMany(AssessmentSlot, { foreignKey: "assessment_id", as: "slots" });
AssessmentSlot.belongsTo(Assessment, { foreignKey: "assessment_id", as: "assessment" });
AssessmentSlot.hasMany(AssessmentSlotBooking, { foreignKey: "slot_id", as: "bookings" });
AssessmentSlotBooking.belongsTo(AssessmentSlot, { foreignKey: "slot_id", as: "slot" });

Assessment.hasMany(ProctorPreflight, { foreignKey: "assessment_id", as: "preflights" });
ProctorPreflight.belongsTo(Assessment, { foreignKey: "assessment_id", as: "assessment" });

export default {
  Assessment,
  AssessmentQuestion,
  AssessmentAssignment,
  AssessmentAttempt,
  AssessmentResponse,
  ProctorSession,
  ProctorEvent,
  BadgeDefinition,
  StudentBadge,
  AssessmentSlot,
  AssessmentSlotBooking,
  ProctorPreflight,
};
