import { BaseRepository } from "../../../core/base.repository";
import { NotificationPreferences } from "../model/notification_preferences.model";

export class NotificationPreferencesRepository extends BaseRepository<NotificationPreferences> {
    constructor() {
        super(NotificationPreferences);
    }
}
