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
  modelOptions,
  optionalUuid,
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import type { StudentProfile } from "../../student/models/student.model";
import { User } from "../../user/user.model";
import type { JobApplication } from "./application.models";
import type { PlacementDrive } from "./drive.models";

export class PlacementComplianceEvent extends Model<
  InferAttributes<PlacementComplianceEvent>,
  InferCreationAttributes<PlacementComplianceEvent>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare event_type: string;
  declare strike_delta: CreationOptional<number>;
  declare reason: string;
  declare recorded_by: ForeignKey<User["id"]>;
  declare drive_id: CreationOptional<ForeignKey<PlacementDrive["id"]> | null>;
  declare application_id: CreationOptional<ForeignKey<JobApplication["id"]> | null>;
  declare evidence_url: CreationOptional<string | null>;
  declare reversal_event_id: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare recorder?: NonAttribute<User>;
  declare drive?: NonAttribute<PlacementDrive>;
  declare application?: NonAttribute<JobApplication>;
}

export class StudentPlacementCompliance extends Model<
  InferAttributes<StudentPlacementCompliance>,
  InferCreationAttributes<StudentPlacementCompliance>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare active_strikes: CreationOptional<number>;
  declare total_strikes: CreationOptional<number>;
  declare compliance_status: CreationOptional<string>;
  declare debarred_until: CreationOptional<Date | null>;
  declare last_event_at: CreationOptional<Date | null>;
  declare notes: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

PlacementComplianceEvent.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    event_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    strike_delta: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    recorded_by: requiredUuid("users", "RESTRICT"),
    drive_id: optionalUuid("placement_drives", "SET NULL"),
    application_id: optionalUuid("job_applications", "SET NULL"),
    evidence_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    reversal_event_id: optionalUuid("placement_compliance_events", "SET NULL"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "placement_compliance_events", "PlacementComplianceEvent", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["student_id"] },
      { fields: ["event_type"] },
      { fields: ["recorded_by"] },
      { fields: ["created_at"] },
    ],
  })
);

StudentPlacementCompliance.init(
  {
    id: idAttribute,
    student_id: {
      ...requiredUuid("student_profiles", "CASCADE"),
      unique: true,
    },
    active_strikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    total_strikes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },
    compliance_status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "GOOD_STANDING",
    },
    debarred_until: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    last_event_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_placement_compliance", "StudentPlacementCompliance", {
    indexes: [{ unique: true, fields: ["student_id"] }, { fields: ["compliance_status"] }],
  })
);

export default {
  PlacementComplianceEvent,
  StudentPlacementCompliance,
};
