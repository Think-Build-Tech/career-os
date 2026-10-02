import { BaseRepository } from "../../../core/base.repository";
import { NotificationDeliveries } from "../model/notification_deliveries.model";

export class NotificationDeliveriesRepository extends BaseRepository<NotificationDeliveries> {
    constructor() {
        super(NotificationDeliveries);
    }
}
