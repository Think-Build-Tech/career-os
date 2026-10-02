import { BaseService } from "../../../core/base.service";
import { NotificationDeliveries } from "../model/notification_deliveries.model";
import { NotificationDeliveriesRepository } from "../repository/notification-deliveries.repository";

export class NotificationDeliveriesService extends BaseService<NotificationDeliveries> {
    constructor() {
        super(new NotificationDeliveriesRepository());
    }
}
