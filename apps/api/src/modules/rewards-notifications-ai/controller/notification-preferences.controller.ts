import { createResourceHandlers } from "../../../core/controller.utils";
import { NotificationPreferences } from "../model/notification_preferences.model";
import { NotificationPreferencesService } from "../service/notification-preferences.service";

const service = new NotificationPreferencesService();
const handlers = createResourceHandlers<NotificationPreferences>(service);

export const createNotificationPreferences = handlers.create;
export const getNotificationPreferencess = handlers.getAll;
export const getNotificationPreferencesById = handlers.getById;
export const updateNotificationPreferences = handlers.update;
export const deleteNotificationPreferences = handlers.delete;
