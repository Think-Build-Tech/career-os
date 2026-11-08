import { Request, Response } from "express";
import {
  NotificationService,
  NotificationDeliveryService,
  NotificationPreferenceService,
} from "./services";

const notificationService = new NotificationService();
const deliveryService = new NotificationDeliveryService();
const preferenceService = new NotificationPreferenceService();

// Notifications
export async function getAllNotifications(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const notifications = await notificationService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      notifications,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getNotificationById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide notification ID",
      });
    }

    const notification = await notificationService.findById(id);
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createNotification(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.user_id || !data.notification_type || !data.title || !data.body) {
      return res.status(400).json({
        success: false,
        message: "user_id, notification_type, title, and body are required",
      });
    }

    const notification = await notificationService.create(data);
    return res.status(201).json({
      success: true,
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function markNotificationAsRead(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide notification ID",
      });
    }

    const notification = await notificationService.updateById(id, {
      read_at: new Date(),
    } as any);
    return res.status(200).json({
      success: true,
      notification,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Deliveries
export async function getAllDeliveries(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const deliveries = await deliveryService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      deliveries,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createDelivery(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.notification_id || !data.channel) {
      return res.status(400).json({
        success: false,
        message: "notification_id and channel are required",
      });
    }

    const delivery = await deliveryService.create(data);
    return res.status(201).json({
      success: true,
      delivery,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Preferences
export async function getUserPreferences(req: Request, res: Response) {
  try {
    const userId = req.params['userId'] as string;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }

    const preferences = await preferenceService.getPreferences(userId);
    return res.status(200).json({
      success: true,
      preferences,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function setUserPreference(req: Request, res: Response) {
  try {
    const { userId, channel, category, isEnabled } = req.body;
    if (!userId || !channel || !category || typeof isEnabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "userId, channel, category, and isEnabled boolean are required",
      });
    }

    const preference = await preferenceService.setPreference(
      userId,
      channel,
      category,
      isEnabled
    );
    return res.status(200).json({
      success: true,
      preference,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

