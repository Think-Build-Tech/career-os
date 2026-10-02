import { createResourceHandlers } from "../../../core/controller.utils";
import { AiMessages } from "../model/ai_messages.model";
import { AiMessagesService } from "../service/ai-messages.service";

const service = new AiMessagesService();
const handlers = createResourceHandlers<AiMessages>(service);

export const createAiMessages = handlers.create;
export const getAiMessagess = handlers.getAll;
export const getAiMessagesById = handlers.getById;
export const updateAiMessages = handlers.update;
export const deleteAiMessages = handlers.delete;
