import { createResourceHandlers } from "../../../core/controller.utils";
import { AiConversations } from "../model/ai_conversations.model";
import { AiConversationsService } from "../service/ai-conversations.service";

const service = new AiConversationsService();
const handlers = createResourceHandlers<AiConversations>(service);

export const createAiConversations = handlers.create;
export const getAiConversationss = handlers.getAll;
export const getAiConversationsById = handlers.getById;
export const updateAiConversations = handlers.update;
export const deleteAiConversations = handlers.delete;
