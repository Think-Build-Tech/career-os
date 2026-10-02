import { BaseRepository } from "../../../core/base.repository";
import { EventRegistrations } from "../model/event_registrations.model";

export class EventRegistrationsRepository extends BaseRepository<EventRegistrations> {
    constructor() {
        super(EventRegistrations);
    }
}
