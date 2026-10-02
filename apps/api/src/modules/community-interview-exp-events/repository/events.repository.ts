import { BaseRepository } from "../../../core/base.repository";
import { Events } from "../model/events.model";

export class EventsRepository extends BaseRepository<Events> {
    constructor() {
        super(Events);
    }
}
