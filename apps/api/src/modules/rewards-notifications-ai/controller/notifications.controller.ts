import { createResourceHandlers } from "../../../core/controller.utils";
import { Notifications } from "../model/notifications.model";
import { NotificationsService } from "../service/notifications.service";

const service = new NotificationsService();
const handlers = createResourceHandlers<Notifications>(service);

export const createNotifications = handlers.create;
export const getNotificationss = handlers.getAll;
export const getNotificationsById = handlers.getById;
export const updateNotifications = handlers.update;
export const deleteNotifications = handlers.delete;
