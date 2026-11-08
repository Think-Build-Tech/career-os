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
import { StudentProfile } from "../../student/models/student.model";

export class StudentReputationSummary extends Model<
  InferAttributes<StudentReputationSummary>,
  InferCreationAttributes<StudentReputationSummary>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare score: CreationOptional<number>;
  declare recalculated_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

StudentReputationSummary.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: { model: StudentProfile, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    recalculated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "student_reputation_summaries",
    modelName: "StudentReputationSummary",
    timestamps: false,
    underscored: true,
    indexes: [{ unique: true, fields: ["student_id"], name: "unique_reputation_summary_student" }],
  }
);

StudentReputationSummary.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasOne(StudentReputationSummary, {
  foreignKey: "student_id",
  as: "reputation_summary",
  onDelete: "CASCADE",
});

export default StudentReputationSummary;
