import { BaseService } from "../../../core/base.service";
import { AiMessages } from "../model/ai_messages.model";
import { AiMessagesRepository } from "../repository/ai-messages.repository";

export class AiMessagesService extends BaseService<AiMessages> {
    constructor() {
        super(new AiMessagesRepository());
    }
}
