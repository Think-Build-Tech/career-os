import { BaseRepository } from "../../../core/base.repository";
import { EventSpeakers } from "../model/event_speakers.model";

export class EventSpeakersRepository extends BaseRepository<EventSpeakers> {
    constructor() {
        super(EventSpeakers);
    }
}
