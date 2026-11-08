import {
  CreationOptional,
  DataTypes,
  ForeignKey,
  InferAttributes,
  InferCreationAttributes,
  Model,
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

export class Conversation extends Model<
  InferAttributes<Conversation>,
  InferCreationAttributes<Conversation>
> {
  declare id: CreationOptional<string>;
  declare conversation_type: string;
  declare title: CreationOptional<string | null>;
  declare created_by: CreationOptional<string | null>;
  declare status: CreationOptional<string>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

export class ConversationParticipant extends Model<
  InferAttributes<ConversationParticipant>,
  InferCreationAttributes<ConversationParticipant>
> {
  declare id: CreationOptional<string>;
  declare conversation_id: ForeignKey<Conversation["id"]>;
  declare user_id: ForeignKey<string>;
  declare participant_type: string;
  declare joined_at: CreationOptional<Date>;
  declare left_at: CreationOptional<Date | null>;
  declare created_at: CreationOptional<Date>;
}

export class ConversationContext extends Model<
  InferAttributes<ConversationContext>,
  InferCreationAttributes<ConversationContext>
> {
  declare id: CreationOptional<string>;
  declare conversation_id: ForeignKey<Conversation["id"]>;
  declare context_type: string;
  declare resource_id: string;
  declare resource_version_id: CreationOptional<string | null>;
  declare metadata: CreationOptional<Record<string, unknown>>;
  declare created_at: CreationOptional<Date>;
}

export class Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  declare id: CreationOptional<string>;
  declare conversation_id: ForeignKey<Conversation["id"]>;
  declare sender_type: string;
  declare sender_user_id: CreationOptional<string | null>;
  declare message_type: CreationOptional<string>;
  declare content: string;
  declare parent_message_id: CreationOptional<ForeignKey<Message["id"]> | null>;
  declare created_at: CreationOptional<Date>;
  declare edited_at: CreationOptional<Date | null>;
  declare deleted_at: CreationOptional<Date | null>;
}

export class MessageAttachment extends Model<
  InferAttributes<MessageAttachment>,
  InferCreationAttributes<MessageAttachment>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare object_key: string;
  declare file_name: string;
  declare mime_type: string;
  declare size_bytes: CreationOptional<number | null>;
  declare content_hash: CreationOptional<string | null>;
  declare created_at: CreationOptional<Date>;
}

export class MessageReadReceipt extends Model<
  InferAttributes<MessageReadReceipt>,
  InferCreationAttributes<MessageReadReceipt>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare user_id: ForeignKey<string>;
  declare read_at: CreationOptional<Date>;
}

export class AiMessageMetadata extends Model<
  InferAttributes<AiMessageMetadata>,
  InferCreationAttributes<AiMessageMetadata>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare ai_run_id: CreationOptional<string | null>;
  declare model_name: string;
  declare model_version: CreationOptional<string | null>;
  declare prompt_tokens: CreationOptional<number | null>;
  declare completion_tokens: CreationOptional<number | null>;
  declare latency_ms: CreationOptional<number | null>;
  declare retrieval_count: CreationOptional<number | null>;
  declare confidence_score: CreationOptional<number | null>;
  declare created_at: CreationOptional<Date>;
}

export class MessageCitation extends Model<
  InferAttributes<MessageCitation>,
  InferCreationAttributes<MessageCitation>
> {
  declare id: CreationOptional<string>;
  declare message_id: ForeignKey<Message["id"]>;
  declare knowledge_chunk_id: ForeignKey<string>;
  declare rank: number;
  declare similarity_score: CreationOptional<number | null>;
  declare quoted_text_start: CreationOptional<number | null>;
  declare quoted_text_end: CreationOptional<number | null>;
  declare created_at: CreationOptional<Date>;
}

Conversation.init(
  {
    id: idAttribute,
    conversation_type: { type: DataTypes.STRING(40), allowNull: false },
    title: { type: DataTypes.STRING, allowNull: true },
    created_by: optionalUuid("users"),
    status: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "ACTIVE" },
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
    updated_at: updatedAtAttribute,
  },
  modelOptions(sequelize, "conversations", "Conversation", {
    indexes: [{ fields: ["conversation_type", "status"] }, { fields: ["created_by"] }],
  })
);

ConversationParticipant.init(
  {
    id: idAttribute,
    conversation_id: requiredUuid("conversations", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    participant_type: { type: DataTypes.STRING(32), allowNull: false },
    joined_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    left_at: { type: DataTypes.DATE, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "conversation_participants", "ConversationParticipant", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["conversation_id", "user_id"] },
      { fields: ["user_id"] },
    ],
  })
);

ConversationContext.init(
  {
    id: idAttribute,
    conversation_id: requiredUuid("conversations", "CASCADE"),
    context_type: { type: DataTypes.STRING(40), allowNull: false },
    resource_id: { type: DataTypes.UUID, allowNull: false },
    resource_version_id: optionalUuid(),
    metadata: jsonObjectAttribute,
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "conversation_contexts", "ConversationContext", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { unique: true, fields: ["conversation_id", "context_type", "resource_id", "resource_version_id"] },
      { fields: ["context_type", "resource_id"] },
    ],
  })
);

Message.init(
  {
    id: idAttribute,
    conversation_id: requiredUuid("conversations", "CASCADE"),
    sender_type: { type: DataTypes.STRING(32), allowNull: false },
    sender_user_id: optionalUuid("users"),
    message_type: { type: DataTypes.STRING(32), allowNull: false, defaultValue: "TEXT" },
    content: { type: DataTypes.TEXT, allowNull: false },
    parent_message_id: optionalUuid("messages"),
    created_at: createdAtAttribute,
    edited_at: { type: DataTypes.DATE, allowNull: true },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
  },
  modelOptions(sequelize, "messages", "Message", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      { fields: ["conversation_id", "created_at"] },
      { fields: ["sender_user_id"] },
      { fields: ["parent_message_id"] },
    ],
  })
);

MessageAttachment.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    object_key: { type: DataTypes.STRING(2048), allowNull: false },
    file_name: { type: DataTypes.STRING, allowNull: false },
    mime_type: { type: DataTypes.STRING(120), allowNull: false },
    size_bytes: { type: DataTypes.BIGINT, allowNull: true },
    content_hash: { type: DataTypes.STRING(128), allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "message_attachments", "MessageAttachment", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ fields: ["message_id"] }],
  })
);

MessageReadReceipt.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    user_id: requiredUuid("users", "CASCADE"),
    read_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  modelOptions(sequelize, "message_read_receipts", "MessageReadReceipt", {
    timestamps: false,
    indexes: [{ unique: true, fields: ["message_id", "user_id"] }, { fields: ["user_id"] }],
  })
);

AiMessageMetadata.init(
  {
    id: idAttribute,
    message_id: { ...requiredUuid("messages", "CASCADE"), unique: true },
    ai_run_id: optionalUuid("ai_runs"),
    model_name: { type: DataTypes.STRING(120), allowNull: false },
    model_version: { type: DataTypes.STRING(120), allowNull: true },
    prompt_tokens: { type: DataTypes.INTEGER, allowNull: true },
    completion_tokens: { type: DataTypes.INTEGER, allowNull: true },
    latency_ms: { type: DataTypes.INTEGER, allowNull: true },
    retrieval_count: { type: DataTypes.INTEGER, allowNull: true },
    confidence_score: { type: DataTypes.DECIMAL(6, 5), allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "ai_message_metadata", "AiMessageMetadata", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  })
);

MessageCitation.init(
  {
    id: idAttribute,
    message_id: requiredUuid("messages", "CASCADE"),
    knowledge_chunk_id: requiredUuid("knowledge_chunks", "RESTRICT"),
    rank: { type: DataTypes.SMALLINT, allowNull: false, validate: { min: 1 } },
    similarity_score: { type: DataTypes.DECIMAL(8, 7), allowNull: true },
    quoted_text_start: { type: DataTypes.INTEGER, allowNull: true },
    quoted_text_end: { type: DataTypes.INTEGER, allowNull: true },
    created_at: createdAtAttribute,
  },
  modelOptions(sequelize, "message_citations", "MessageCitation", {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [{ unique: true, fields: ["message_id", "rank"] }, { fields: ["knowledge_chunk_id"] }],
  })
);

Conversation.hasMany(ConversationParticipant, { foreignKey: "conversation_id", as: "participants" });
Conversation.hasMany(ConversationContext, { foreignKey: "conversation_id", as: "contexts" });
Conversation.hasMany(Message, { foreignKey: "conversation_id", as: "messages" });
Message.belongsTo(Conversation, { foreignKey: "conversation_id", as: "conversation" });
Message.hasMany(MessageAttachment, { foreignKey: "message_id", as: "attachments" });
Message.hasMany(MessageReadReceipt, { foreignKey: "message_id", as: "read_receipts" });
Message.hasOne(AiMessageMetadata, { foreignKey: "message_id", as: "ai_metadata" });
Message.hasMany(MessageCitation, { foreignKey: "message_id", as: "citations" });

export default {
  Conversation,
  ConversationParticipant,
  ConversationContext,
  Message,
  MessageAttachment,
  MessageReadReceipt,
  AiMessageMetadata,
  MessageCitation,
};
