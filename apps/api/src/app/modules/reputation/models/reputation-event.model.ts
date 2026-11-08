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

export class StudentReputationEvent extends Model<
  InferAttributes<StudentReputationEvent>,
  InferCreationAttributes<StudentReputationEvent>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare event_type: string;
  declare points: number;
  declare reference_type: CreationOptional<string | null>;
  declare reference_id: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

StudentReputationEvent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: StudentProfile, key: "id" },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    event_type: { type: DataTypes.STRING(64), allowNull: false },
    points: { type: DataTypes.INTEGER, allowNull: false },
    reference_type: { type: DataTypes.STRING(64), allowNull: true },
    reference_id: { type: DataTypes.UUID, allowNull: true },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "reputation_events",
    modelName: "StudentReputationEvent",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    underscored: true,
    validate: {
      referenceIsComplete() {
        if ((this.reference_type == null) !== (this.reference_id == null)) {
          throw new Error("reference_type and reference_id must be supplied together");
        }
      },
    },
    indexes: [
      { fields: ["student_id", "created_at"], name: "idx_reputation_events_student_created" },
      { fields: ["event_type"], name: "idx_reputation_events_type" },
      { fields: ["reference_type", "reference_id"], name: "idx_reputation_events_reference" },
    ],
  }
);

StudentReputationEvent.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(StudentReputationEvent, {
  foreignKey: "student_id",
  as: "reputation_events",
  onDelete: "CASCADE",
});

export default StudentReputationEvent;
