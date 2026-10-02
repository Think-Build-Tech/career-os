import { createResourceHandlers } from "../../../core/controller.utils";
import { NotificationDeliveries } from "../model/notification_deliveries.model";
import { NotificationDeliveriesService } from "../service/notification-deliveries.service";

const service = new NotificationDeliveriesService();
const handlers = createResourceHandlers<NotificationDeliveries>(service);

export const createNotificationDeliveries = handlers.create;
export const getNotificationDeliveriess = handlers.getAll;
export const getNotificationDeliveriesById = handlers.getById;
export const updateNotificationDeliveries = handlers.update;
export const deleteNotificationDeliveries = handlers.delete;
