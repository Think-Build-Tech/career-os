import { BaseService } from "../../../core/base.service";
import { EventSpeakers } from "../model/event_speakers.model";
import { EventSpeakersRepository } from "../repository/event-speakers.repository";

export class EventSpeakersService extends BaseService<EventSpeakers> {
    constructor() {
        super(new EventSpeakersRepository());
    }
}
