import { BaseService } from "../../../core/base.service";
import { AiConversations } from "../model/ai_conversations.model";
import { AiConversationsRepository } from "../repository/ai-conversations.repository";

export class AiConversationsService extends BaseService<AiConversations> {
    constructor() {
        super(new AiConversationsRepository());
    }
}
