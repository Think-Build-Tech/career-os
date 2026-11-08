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
import { User } from "../../user/user.model";
import { StudentProfile } from "./student.model";

export class StudentRequest extends Model<
  InferAttributes<StudentRequest>,
  InferCreationAttributes<StudentRequest>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare request_type: string;
  declare status: CreationOptional<string>;
  declare title: string;
  declare details: string;
  declare supporting_document_url: CreationOptional<string | null>;
  declare target_entity_type: CreationOptional<string | null>;
  declare target_entity_id: CreationOptional<string | null>;
  declare reviewed_by: CreationOptional<ForeignKey<User["id"]> | null>;
  declare reviewed_at: CreationOptional<Date | null>;
  declare reviewer_notes: CreationOptional<string | null>;
  declare generated_document_key: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
  declare reviewer?: NonAttribute<User>;
}

StudentRequest.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    request_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "PENDING",
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    supporting_document_url: {
      type: DataTypes.STRING(2048),
      allowNull: true,
    },
    target_entity_type: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    target_entity_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    reviewed_by: optionalUuid("users", "SET NULL"),
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    reviewer_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    generated_document_key: {
      type: DataTypes.STRING(512),
      allowNull: true,
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_requests", "StudentRequest", {
    indexes: [
      { fields: ["student_id"] },
      { fields: ["request_type"] },
      { fields: ["status"] },
      { fields: ["reviewed_by"] },
      { fields: ["created_at"] },
    ],
  })
);

StudentRequest.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(StudentRequest, {
  foreignKey: "student_id",
  as: "requests",
  onDelete: "CASCADE",
});
StudentRequest.belongsTo(User, { foreignKey: "reviewed_by", as: "reviewer" });

export default StudentRequest;

