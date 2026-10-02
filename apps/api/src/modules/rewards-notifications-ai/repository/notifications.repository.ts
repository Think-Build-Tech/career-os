import { BaseRepository } from "../../../core/base.repository";
import { Notifications } from "../model/notifications.model";

export class NotificationsRepository extends BaseRepository<Notifications> {
    constructor() {
        super(Notifications);
    }
}
