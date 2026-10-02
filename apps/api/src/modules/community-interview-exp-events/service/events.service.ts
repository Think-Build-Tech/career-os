import { BaseService } from "../../../core/base.service";
import { Events } from "../model/events.model";
import { EventsRepository } from "../repository/events.repository";

export class EventsService extends BaseService<Events> {
    constructor() {
        super(new EventsRepository());
    }
}
