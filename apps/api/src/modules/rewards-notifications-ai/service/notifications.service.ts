import { BaseService } from "../../../core/base.service";
import { Notifications } from "../model/notifications.model";
import { NotificationsRepository } from "../repository/notifications.repository";

export class NotificationsService extends BaseService<Notifications> {
    constructor() {
        super(new NotificationsRepository());
    }
}
