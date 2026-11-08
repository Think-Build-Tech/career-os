import { Router } from "express";
import {
  getAllNotifications,
  getNotificationById,
  createNotification,
  markNotificationAsRead,
  getAllDeliveries,
  createDelivery,
  getUserPreferences,
  setUserPreference,
} from "./notification.controller";

export const notificationRouter = Router();

// Notifications
notificationRouter.get("/", getAllNotifications);
notificationRouter.post("/", createNotification);
notificationRouter.patch("/:id/read", markNotificationAsRead);
notificationRouter.get("/:id", getNotificationById);

// Deliveries
notificationRouter.get("/deliveries/all", getAllDeliveries);
notificationRouter.post("/deliveries", createDelivery);

// Preferences
notificationRouter.get("/preferences/:userId", getUserPreferences);
notificationRouter.post("/preferences", setUserPreference);

