import { MutableService, MutationOptions } from "../../services";
import { InvalidServiceInputError } from "../../services/service.errors";
import { Notification, NotificationDelivery, NotificationPreference } from "../models";

export class NotificationService extends MutableService<Notification> {
  constructor() { super(Notification); }
}
export class NotificationDeliveryService extends MutableService<NotificationDelivery> {
  constructor() { super(NotificationDelivery); }
}
export class NotificationPreferenceService extends MutableService<NotificationPreference> {
  constructor() { super(NotificationPreference); }

  private static readonly MANDATORY_CATEGORIES = new Set([
    "PLACEMENT_OFFER",
    "INTERVIEW_SCHEDULE",
    "COMPLIANCE_ALERT",
    "POLICY_ENFORCEMENT",
  ]);

  async getPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.model.findAll({
      where: { user_id: userId },
      order: [["category", "ASC"], ["channel", "ASC"]],
    });
  }

  async setPreference(
    userId: string,
    channel: string,
    category: string,
    isEnabled: boolean,
    options: MutationOptions = {}
  ): Promise<NotificationPreference> {
    const normalizedCategory = category.toUpperCase();
    const normalizedChannel = channel.toUpperCase();

    // Critical notifications on in-app cannot be disabled
    if (
      !isEnabled &&
      normalizedChannel === "IN_APP" &&
      NotificationPreferenceService.MANDATORY_CATEGORIES.has(normalizedCategory)
    ) {
      throw new InvalidServiceInputError(
        `Placement-critical category '${category}' cannot be disabled for in-app delivery`
      );
    }

    const [pref] = await this.model.findOrCreate({
      where: {
        user_id: userId,
        channel: normalizedChannel,
        category: normalizedCategory,
      },
      defaults: {
        user_id: userId,
        channel: normalizedChannel,
        category: normalizedCategory,
        is_enabled: isEnabled,
      },
      transaction: options.transaction,
    });

    if (pref.is_enabled !== isEnabled) {
      pref.is_enabled = isEnabled;
      await pref.save({ transaction: options.transaction });
    }

    return pref;
  }

  async isChannelEnabled(
    userId: string,
    channel: string,
    category: string
  ): Promise<boolean> {
    const normalizedCategory = category.toUpperCase();
    const normalizedChannel = channel.toUpperCase();

    if (
      normalizedChannel === "IN_APP" &&
      NotificationPreferenceService.MANDATORY_CATEGORIES.has(normalizedCategory)
    ) {
      return true;
    }

    const pref = await this.model.findOne({
      where: {
        user_id: userId,
        channel: normalizedChannel,
        category: normalizedCategory,
      },
    });

    return pref ? pref.is_enabled : true; // Default opt-in
  }
}

