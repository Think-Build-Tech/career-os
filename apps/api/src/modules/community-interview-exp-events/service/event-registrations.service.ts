import { BaseService } from "../../../core/base.service";
import { EventRegistrations } from "../model/event_registrations.model";
import { EventRegistrationsRepository } from "../repository/event-registrations.repository";

export class EventRegistrationsService extends BaseService<EventRegistrations> {
    constructor() {
        super(new EventRegistrationsRepository());
    }
}
