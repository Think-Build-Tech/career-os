import { CreateReadService, CrudService, MutableService } from "../../services";
import {
  AiMessageMetadata,
  Conversation,
  ConversationContext,
  ConversationParticipant,
  Message,
  MessageAttachment,
  MessageCitation,
  MessageReadReceipt,
} from "../models";

export class ConversationService extends CrudService<Conversation> {
  constructor() { super(Conversation); }
}
export class ConversationParticipantService extends CrudService<ConversationParticipant> {
  constructor() { super(ConversationParticipant); }
}
export class ConversationContextService extends CreateReadService<ConversationContext> {
  constructor() { super(ConversationContext); }
}
export class MessageService extends MutableService<Message> {
  constructor() { super(Message); }
}
export class MessageAttachmentService extends CrudService<MessageAttachment> {
  constructor() { super(MessageAttachment); }
}
export class MessageReadReceiptService extends CreateReadService<MessageReadReceipt> {
  constructor() { super(MessageReadReceipt); }
}
export class AiMessageMetadataService extends CreateReadService<AiMessageMetadata> {
  constructor() { super(AiMessageMetadata); }
}
export class MessageCitationService extends CreateReadService<MessageCitation> {
  constructor() { super(MessageCitation); }
}
