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

export class StudentActionItem extends Model<
  InferAttributes<StudentActionItem>,
  InferCreationAttributes<StudentActionItem>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare action_type: string;
  declare title: string;
  declare description: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare priority: CreationOptional<string>;
  declare deadline: CreationOptional<Date | null>;
  declare action_url: CreationOptional<string | null>;
  declare target_entity_type: CreationOptional<string | null>;
  declare target_entity_id: CreationOptional<string | null>;
  declare completed_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

StudentActionItem.init(
  {
    id: idAttribute,
    student_id: requiredUuid("student_profiles", "CASCADE"),
    action_type: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "PENDING",
    },
    priority: {
      type: DataTypes.STRING(32),
      allowNull: false,
      defaultValue: "MEDIUM",
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    action_url: {
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
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "student_action_items", "StudentActionItem", {
    indexes: [
      { fields: ["student_id"] },
      { fields: ["status"] },
      { fields: ["priority"] },
      { fields: ["deadline"] },
      { fields: ["action_type"] },
    ],
  })
);

StudentActionItem.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(StudentActionItem, {
  foreignKey: "student_id",
  as: "action_items",
  onDelete: "CASCADE",
});

export default StudentActionItem;

