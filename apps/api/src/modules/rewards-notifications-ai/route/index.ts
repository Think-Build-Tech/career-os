import { Router } from "express";
import { createRewardRules, getRewardRuless, getRewardRulesById, updateRewardRules, deleteRewardRules } from "../controller/reward-rules.controller";
import { createBadges, getBadgess, getBadgesById, updateBadges, deleteBadges } from "../controller/badges.controller";
import { createMemberBadges, getMemberBadgess, getMemberBadgesById, updateMemberBadges, deleteMemberBadges } from "../controller/member-badges.controller";
import { createNotifications, getNotificationss, getNotificationsById, updateNotifications, deleteNotifications } from "../controller/notifications.controller";
import { createNotificationPreferences, getNotificationPreferencess, getNotificationPreferencesById, updateNotificationPreferences, deleteNotificationPreferences } from "../controller/notification-preferences.controller";
import { createNotificationDeliveries, getNotificationDeliveriess, getNotificationDeliveriesById, updateNotificationDeliveries, deleteNotificationDeliveries } from "../controller/notification-deliveries.controller";
import { createAiConversations, getAiConversationss, getAiConversationsById, updateAiConversations, deleteAiConversations } from "../controller/ai-conversations.controller";
import { createAiMessages, getAiMessagess, getAiMessagesById, updateAiMessages, deleteAiMessages } from "../controller/ai-messages.controller";
import { createAiRecommendations, getAiRecommendationss, getAiRecommendationsById, updateAiRecommendations, deleteAiRecommendations } from "../controller/ai-recommendations.controller";
import { createSkillGapSnapshots, getSkillGapSnapshotss, getSkillGapSnapshotsById, updateSkillGapSnapshots, deleteSkillGapSnapshots } from "../controller/skill-gap-snapshots.controller";

const router: Router = Router();

// RewardRuless
router.route("/reward-ruless").get(getRewardRuless).post(createRewardRules);
router.route("/reward-ruless/:id").get(getRewardRulesById).patch(updateRewardRules).delete(deleteRewardRules);


// Badgess
router.route("/badgess").get(getBadgess).post(createBadges);
router.route("/badgess/:id").get(getBadgesById).patch(updateBadges).delete(deleteBadges);


// MemberBadgess
router.route("/member-badgess").get(getMemberBadgess).post(createMemberBadges);
router.route("/member-badgess/:id").get(getMemberBadgesById).patch(updateMemberBadges).delete(deleteMemberBadges);


// Notificationss
router.route("/notificationss").get(getNotificationss).post(createNotifications);
router.route("/notificationss/:id").get(getNotificationsById).patch(updateNotifications).delete(deleteNotifications);


// NotificationPreferencess
router.route("/notification-preferencess").get(getNotificationPreferencess).post(createNotificationPreferences);
router.route("/notification-preferencess/:id").get(getNotificationPreferencesById).patch(updateNotificationPreferences).delete(deleteNotificationPreferences);


// NotificationDeliveriess
router.route("/notification-deliveriess").get(getNotificationDeliveriess).post(createNotificationDeliveries);
router.route("/notification-deliveriess/:id").get(getNotificationDeliveriesById).patch(updateNotificationDeliveries).delete(deleteNotificationDeliveries);


// AiConversationss
router.route("/ai-conversationss").get(getAiConversationss).post(createAiConversations);
router.route("/ai-conversationss/:id").get(getAiConversationsById).patch(updateAiConversations).delete(deleteAiConversations);


// AiMessagess
router.route("/ai-messagess").get(getAiMessagess).post(createAiMessages);
router.route("/ai-messagess/:id").get(getAiMessagesById).patch(updateAiMessages).delete(deleteAiMessages);


// AiRecommendationss
router.route("/ai-recommendationss").get(getAiRecommendationss).post(createAiRecommendations);
router.route("/ai-recommendationss/:id").get(getAiRecommendationsById).patch(updateAiRecommendations).delete(deleteAiRecommendations);


// SkillGapSnapshotss
router.route("/skill-gap-snapshotss").get(getSkillGapSnapshotss).post(createSkillGapSnapshots);
router.route("/skill-gap-snapshotss/:id").get(getSkillGapSnapshotsById).patch(updateSkillGapSnapshots).delete(deleteSkillGapSnapshots);

export default router;
