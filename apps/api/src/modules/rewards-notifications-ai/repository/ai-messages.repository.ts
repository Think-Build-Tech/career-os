import { BaseRepository } from "../../../core/base.repository";
import { AiMessages } from "../model/ai_messages.model";

export class AiMessagesRepository extends BaseRepository<AiMessages> {
    constructor() {
        super(AiMessages);
    }
}
