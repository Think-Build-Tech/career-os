import { Router } from "express";
import { createMentorProfiles, getMentorProfiless, getMentorProfilesById, updateMentorProfiles, deleteMentorProfiles } from "../controller/mentor-profiles.controller";
import { createMentorSkills, getMentorSkillss, getMentorSkillsById, updateMentorSkills, deleteMentorSkills } from "../controller/mentor-skills.controller";
import { createMentorshipRequests, getMentorshipRequestss, getMentorshipRequestsById, updateMentorshipRequests, deleteMentorshipRequests } from "../controller/mentorship-requests.controller";
import { createMentorshipRelationships, getMentorshipRelationshipss, getMentorshipRelationshipsById, updateMentorshipRelationships, deleteMentorshipRelationships } from "../controller/mentorship-relationships.controller";
import { createMentorshipGoals, getMentorshipGoalss, getMentorshipGoalsById, updateMentorshipGoals, deleteMentorshipGoals } from "../controller/mentorship-goals.controller";
import { createMentorshipSessions, getMentorshipSessionss, getMentorshipSessionsById, updateMentorshipSessions, deleteMentorshipSessions } from "../controller/mentorship-sessions.controller";
import { createMentorshipFeedback, getMentorshipFeedbacks, getMentorshipFeedbackById, updateMentorshipFeedback, deleteMentorshipFeedback } from "../controller/mentorship-feedback.controller";
import { createReferralOpportunities, getReferralOpportunitiess, getReferralOpportunitiesById, updateReferralOpportunities, deleteReferralOpportunities } from "../controller/referral-opportunities.controller";
import { createReferralRequests, getReferralRequestss, getReferralRequestsById, updateReferralRequests, deleteReferralRequests } from "../controller/referral-requests.controller";

const router: Router = Router();

// MentorProfiless
router.route("/mentor-profiless").get(getMentorProfiless).post(createMentorProfiles);
router.route("/mentor-profiless/:id").get(getMentorProfilesById).patch(updateMentorProfiles).delete(deleteMentorProfiles);


// MentorSkillss
router.route("/mentor-skillss").get(getMentorSkillss).post(createMentorSkills);
router.route("/mentor-skillss/:id").get(getMentorSkillsById).patch(updateMentorSkills).delete(deleteMentorSkills);


// MentorshipRequestss
router.route("/mentorship-requestss").get(getMentorshipRequestss).post(createMentorshipRequests);
router.route("/mentorship-requestss/:id").get(getMentorshipRequestsById).patch(updateMentorshipRequests).delete(deleteMentorshipRequests);


// MentorshipRelationshipss
router.route("/mentorship-relationshipss").get(getMentorshipRelationshipss).post(createMentorshipRelationships);
router.route("/mentorship-relationshipss/:id").get(getMentorshipRelationshipsById).patch(updateMentorshipRelationships).delete(deleteMentorshipRelationships);


// MentorshipGoalss
router.route("/mentorship-goalss").get(getMentorshipGoalss).post(createMentorshipGoals);
router.route("/mentorship-goalss/:id").get(getMentorshipGoalsById).patch(updateMentorshipGoals).delete(deleteMentorshipGoals);


// MentorshipSessionss
router.route("/mentorship-sessionss").get(getMentorshipSessionss).post(createMentorshipSessions);
router.route("/mentorship-sessionss/:id").get(getMentorshipSessionsById).patch(updateMentorshipSessions).delete(deleteMentorshipSessions);


// MentorshipFeedbacks
router.route("/mentorship-feedbacks").get(getMentorshipFeedbacks).post(createMentorshipFeedback);
router.route("/mentorship-feedbacks/:id").get(getMentorshipFeedbackById).patch(updateMentorshipFeedback).delete(deleteMentorshipFeedback);


// ReferralOpportunitiess
router.route("/referral-opportunitiess").get(getReferralOpportunitiess).post(createReferralOpportunities);
router.route("/referral-opportunitiess/:id").get(getReferralOpportunitiesById).patch(updateReferralOpportunities).delete(deleteReferralOpportunities);


// ReferralRequestss
router.route("/referral-requestss").get(getReferralRequestss).post(createReferralRequests);
router.route("/referral-requestss/:id").get(getReferralRequestsById).patch(updateReferralRequests).delete(deleteReferralRequests);

export default router;
