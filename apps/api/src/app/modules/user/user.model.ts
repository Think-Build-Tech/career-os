import {
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  NonAttribute,
  UpdateOptions,
} from "sequelize";
import { sequelize } from "../../config/database";
import type { StudentProfile } from "../student/models/student.model";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<string>;
  declare global_user_id: CreationOptional<string | null>;
  declare email: string;
  declare phone: CreationOptional<string | null>;
  declare first_name: string;
  declare last_name: CreationOptional<string | null>;
  declare avatar_url: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;

  declare student_profile?: NonAttribute<StudentProfile>;

  // Virtual helper getter
  get fullName(): NonAttribute<string> {
    return [this.first_name, this.last_name].filter(Boolean).join(" ");
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    global_user_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    avatar_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "ACTIVE",
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "users",
    modelName: "User",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    hooks: {
      beforeUpdate: (user) => {
        user.updated_at = new Date();
      },
      beforeBulkUpdate: (
        options: UpdateOptions<InferAttributes<User>> & {
          attributes?: Record<string, unknown>;
        }
      ) => {
        if (options.attributes) {
          options.attributes.updated_at = new Date();
        }
        if (options.fields && !options.fields.includes("updated_at")) {
          options.fields.push("updated_at");
        }
      },
    },
    indexes: [
      {
        unique: true,
        fields: ["email"],
        name: "unique_users_email",
      },
      {
        fields: ["global_user_id"],
        name: "idx_users_global_user_id",
      },
      {
        fields: ["status"],
        name: "idx_users_status",
      },
      {
        fields: ["phone"],
        name: "idx_users_phone",
      },
    ],
  }
);

export default User;
