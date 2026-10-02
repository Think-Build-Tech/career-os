import { BaseRepository } from "../../../core/base.repository";
import { AiConversations } from "../model/ai_conversations.model";

export class AiConversationsRepository extends BaseRepository<AiConversations> {
    constructor() {
        super(AiConversations);
    }
}
