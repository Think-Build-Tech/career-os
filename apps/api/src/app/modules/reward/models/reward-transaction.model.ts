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

export class RewardTransaction extends Model<
  InferAttributes<RewardTransaction>,
  InferCreationAttributes<RewardTransaction>
> {
  declare id: CreationOptional<string>;
  declare student_id: ForeignKey<StudentProfile["id"]>;
  declare transaction_type: "EARN" | "REDEEM" | "EXPIRE" | "ADJUSTMENT";
  declare points: number;
  declare reason: string;
  declare reference_type: CreationOptional<string | null>;
  declare reference_id: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;

  declare student?: NonAttribute<StudentProfile>;
}

RewardTransaction.init(
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
    transaction_type: {
      type: DataTypes.ENUM("EARN", "REDEEM", "EXPIRE", "ADJUSTMENT"),
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notIn: [[0]] },
    },
    reason: { type: DataTypes.TEXT, allowNull: false },
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
    tableName: "reward_transactions",
    modelName: "RewardTransaction",
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
      { fields: ["student_id", "created_at"], name: "idx_reward_transactions_student_created" },
      { fields: ["transaction_type"], name: "idx_reward_transactions_type" },
      { fields: ["reference_type", "reference_id"], name: "idx_reward_transactions_reference" },
    ],
  }
);

RewardTransaction.belongsTo(StudentProfile, { foreignKey: "student_id", as: "student" });
StudentProfile.hasMany(RewardTransaction, {
  foreignKey: "student_id",
  as: "reward_transactions",
  onDelete: "CASCADE",
});

export default RewardTransaction;
