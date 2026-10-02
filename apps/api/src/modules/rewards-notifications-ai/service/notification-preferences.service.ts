import { BaseService } from "../../../core/base.service";
import { NotificationPreferences } from "../model/notification_preferences.model";
import { NotificationPreferencesRepository } from "../repository/notification-preferences.repository";

export class NotificationPreferencesService extends BaseService<NotificationPreferences> {
    constructor() {
        super(new NotificationPreferencesRepository());
    }
}
