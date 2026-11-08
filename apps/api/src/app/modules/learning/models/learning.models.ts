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
import { User } from "../../user/user.model";

export class LearningPost extends Model<
  InferAttributes<LearningPost>,
  InferCreationAttributes<LearningPost>
> {
  declare id: CreationOptional<string>;
  declare author_user_id: ForeignKey<string>;
  declare content_type: string;
  declare title: string;
  declare content: CreationOptional<string | null>;
  declare scope_type: string;
  declare scope_id: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare published_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class LearningResource extends Model<
  InferAttributes<LearningResource>,
  InferCreationAttributes<LearningResource>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare resource_type: string;
  declare url: CreationOptional<string | null>;
  declare object_key: CreationOptional<string | null>;
  declare title: CreationOptional<string | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class LearningTag extends Model<
  InferAttributes<LearningTag>,
  InferCreationAttributes<LearningTag>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare slug: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class LearningPostTag extends Model<
  InferAttributes<LearningPostTag>,
  InferCreationAttributes<LearningPostTag>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare learning_tag_id: ForeignKey<LearningTag["id"]>;
  declare created_at: CreationOptional<Date>;
}

export class LearningPostSkill extends Model<
  InferAttributes<LearningPostSkill>,
  InferCreationAttributes<LearningPostSkill>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare skill_id: ForeignKey<string>;
  declare created_at: CreationOptional<Date>;
}

export class LearningReaction extends Model<
  InferAttributes<LearningReaction>,
  InferCreationAttributes<LearningReaction>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare user_id: ForeignKey<string>;
  declare reaction_type: string;
  declare created_at: CreationOptional<Date>;
}

export class LearningComment extends Model<
  InferAttributes<LearningComment>,
  InferCreationAttributes<LearningComment>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare user_id: ForeignKey<string>;
  declare parent_comment_id: CreationOptional<ForeignKey<LearningComment["id"]> | null>;
  declare content: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
  declare deleted_at: CreationOptional<Date | null>;
}

export class LearningSave extends Model<
  InferAttributes<LearningSave>,
  InferCreationAttributes<LearningSave>
> {
  declare id: CreationOptional<string>;
  declare learning_post_id: ForeignKey<LearningPost["id"]>;
  declare user_id: ForeignKey<string>;
  declare created_at: CreationOptional<Date>;
}

export class SavedItem extends Model<
  InferAttributes<SavedItem>,
  InferCreationAttributes<SavedItem>
> {
  declare id: CreationOptional<string>;
  declare user_id: ForeignKey<User["id"]>;
  declare student_id: CreationOptional<ForeignKey<StudentProfile["id"]> | null>;
  declare item_type: string;
  declare item_id: string;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;

  declare user?: NonAttribute<User>;
  declare student?: NonAttribute<StudentProfile>;
}

LearningPost.init(
  {
    id: idAttribute,
    author_user_id: requiredUuid("users", "CASCADE"),
    content_type: { type: DataTypes.STRING(32), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    content: { type: DataTypes.TEXT, allowNull: true },
    scope_type: { type: DataTypes.STRING(32), allowNull: false },
    scope_id: optionalUuid(),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "DRAFT" },
    published_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "learning_posts", "LearningPost", {
    indexes: [
      { fields: ["author_user_id"] },
      { fields: ["scope_type", "scope_id"] },
      { fields: ["status", "published_at"] },
    ],
  })
);

LearningResource.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    resource_type: { type: DataTypes.STRING(32), allowNull: false },
    url: { type: DataTypes.STRING(2048), allowNull: true, validate: { isUrl: true } },
    object_key: { type: DataTypes.STRING(2048), allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "learning_resources", "LearningResource", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["learning_post_id"] }],
  })
);

LearningTag.init(
  {
    id: idAttribute,
    name: { type: DataTypes.STRING(100), allowNull: false },
    slug: { type: DataTypes.STRING(120), allowNull: false, unique: true },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "learning_tags", "LearningTag")
);

LearningPostTag.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    learning_tag_id: requiredUuid("learning_tags", "CASCADE"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "learning_post_tags", "LearningPostTag", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["learning_post_id", "learning_tag_id"] }],
  })
);

LearningPostSkill.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    skill_id: requiredUuid("skills", "RESTRICT"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "learning_post_skills", "LearningPostSkill", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["learning_post_id", "skill_id"] }, { fields: ["skill_id"] }],
  })
);

LearningReaction.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    reaction_type: { type: DataTypes.STRING(32), allowNull: false },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "learning_reactions", "LearningReaction", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["learning_post_id", "user_id"] }],
  })
);

LearningComment.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    parent_comment_id: optionalUuid("learning_comments"),
    content: { type: DataTypes.TEXT, allowNull: false },
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  modelOptions(sequelize, "learning_comments", "LearningComment", {
    indexes: [{ fields: ["learning_post_id", "created_at"] }, { fields: ["parent_comment_id"] }],
  })
);

LearningSave.init(
  {
    id: idAttribute,
    learning_post_id: requiredUuid("learning_posts", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "learning_saves", "LearningSave", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["learning_post_id", "user_id"] }, { fields: ["user_id"] }],
  })
);

LearningPost.hasMany(LearningResource, { foreignKey: "learning_post_id", as: "resources" });
LearningPost.hasMany(LearningComment, { foreignKey: "learning_post_id", as: "comments" });
LearningPost.hasMany(LearningReaction, { foreignKey: "learning_post_id", as: "reactions" });
LearningPost.belongsToMany(LearningTag, {
  through: LearningPostTag,
  foreignKey: "learning_post_id",
  otherKey: "learning_tag_id",
  as: "tags",
});

SavedItem.init(
  {
    id: idAttribute,
    user_id: requiredUuid("users", "CASCADE"),
    student_id: optionalUuid("student_profiles", "CASCADE"),
    item_type: { type: DataTypes.STRING(32), allowNull: false },
    item_id: { type: DataTypes.UUID, allowNull: false },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "saved_items", "SavedItem", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["user_id", "item_type", "item_id"] },
      { fields: ["student_id"] },
      { fields: ["item_type", "item_id"] },
    ],
  })
);

export default {
  LearningPost,
  LearningResource,
  LearningTag,
  LearningPostTag,
  LearningPostSkill,
  LearningReaction,
  LearningComment,
  LearningSave,
  SavedItem,
};
