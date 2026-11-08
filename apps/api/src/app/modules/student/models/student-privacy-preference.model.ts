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
  requiredUuid,
  updatedAtAttribute,
} from "../../models/model.helpers";
import { StudentProfile } from "./student.model";

export class StudentPrivacyPreference extends Model<
  InferAttributes<StudentPrivacyPreference>,
  InferCreationAttributes<StudentPrivacyPreference>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare recruiter_discovery_enabled: CreationOptional<boolean>;
  declare resume_visibility: CreationOptional<string>;
  declare alumni_connection_enabled: CreationOptional<boolean>;
  declare learning_profile_visibility: CreationOptional<string>;
  declare assessment_visibility: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

StudentPrivacyPreference.init(
  {
    id: idAttribute,
    student_id: {
      ...requiredUuid("student_profiles", "CASCADE"),
      unique: true,
    },
    recruiter_discovery_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    resume_visibility: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "VERIFIED_ONLY",
    },
    alumni_connection_enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    learning_profile_visibility: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "CAMPUS_ONLY",
    },
    assessment_visibility: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "CAMPUS_ONLY",
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_privacy_preferences", "StudentPrivacyPreference", {
    indexes: [{ unique: true, fields: ["student_id"] }],
  })
);

StudentPrivacyPreference.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasOne(StudentPrivacyPreference, {
  foreignKey: "student_id",
  as: "privacy_preference",
  onDelete: "CASCADE",
});

export default StudentPrivacyPreference;

