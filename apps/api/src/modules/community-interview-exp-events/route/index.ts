import { Router } from "express";
import { createPosts, getPostss, getPostsById, updatePosts, deletePosts } from "../controller/posts.controller";
import { createComments, getCommentss, getCommentsById, updateComments, deleteComments } from "../controller/comments.controller";
import { createPostReactions, getPostReactionss, getPostReactionsById, updatePostReactions, deletePostReactions } from "../controller/post-reactions.controller";
import { createContentReports, getContentReportss, getContentReportsById, updateContentReports, deleteContentReports } from "../controller/content-reports.controller";
import { createInterviewExperiences, getInterviewExperiencess, getInterviewExperiencesById, updateInterviewExperiences, deleteInterviewExperiences } from "../controller/interview-experiences.controller";
import { createInterviewExperienceRounds, getInterviewExperienceRoundss, getInterviewExperienceRoundsById, updateInterviewExperienceRounds, deleteInterviewExperienceRounds } from "../controller/interview-experience-rounds.controller";
import { createInterviewQuestions, getInterviewQuestionss, getInterviewQuestionsById, updateInterviewQuestions, deleteInterviewQuestions } from "../controller/interview-questions.controller";
import { createEvents, getEventss, getEventsById, updateEvents, deleteEvents } from "../controller/events.controller";
import { createEventSpeakers, getEventSpeakerss, getEventSpeakersById, updateEventSpeakers, deleteEventSpeakers } from "../controller/event-speakers.controller";
import { createEventRegistrations, getEventRegistrationss, getEventRegistrationsById, updateEventRegistrations, deleteEventRegistrations } from "../controller/event-registrations.controller";

const router: Router = Router();

// Postss
router.route("/postss").get(getPostss).post(createPosts);
router.route("/postss/:id").get(getPostsById).patch(updatePosts).delete(deletePosts);


// Commentss
router.route("/commentss").get(getCommentss).post(createComments);
router.route("/commentss/:id").get(getCommentsById).patch(updateComments).delete(deleteComments);


// PostReactionss
router.route("/post-reactionss").get(getPostReactionss).post(createPostReactions);
router.route("/post-reactionss/:id").get(getPostReactionsById).patch(updatePostReactions).delete(deletePostReactions);


// ContentReportss
router.route("/content-reportss").get(getContentReportss).post(createContentReports);
router.route("/content-reportss/:id").get(getContentReportsById).patch(updateContentReports).delete(deleteContentReports);


// InterviewExperiencess
router.route("/interview-experiencess").get(getInterviewExperiencess).post(createInterviewExperiences);
router.route("/interview-experiencess/:id").get(getInterviewExperiencesById).patch(updateInterviewExperiences).delete(deleteInterviewExperiences);


// InterviewExperienceRoundss
router.route("/interview-experience-roundss").get(getInterviewExperienceRoundss).post(createInterviewExperienceRounds);
router.route("/interview-experience-roundss/:id").get(getInterviewExperienceRoundsById).patch(updateInterviewExperienceRounds).delete(deleteInterviewExperienceRounds);


// InterviewQuestionss
router.route("/interview-questionss").get(getInterviewQuestionss).post(createInterviewQuestions);
router.route("/interview-questionss/:id").get(getInterviewQuestionsById).patch(updateInterviewQuestions).delete(deleteInterviewQuestions);


// Eventss
router.route("/eventss").get(getEventss).post(createEvents);
router.route("/eventss/:id").get(getEventsById).patch(updateEvents).delete(deleteEvents);


// EventSpeakerss
router.route("/event-speakerss").get(getEventSpeakerss).post(createEventSpeakers);
router.route("/event-speakerss/:id").get(getEventSpeakersById).patch(updateEventSpeakers).delete(deleteEventSpeakers);


// EventRegistrationss
router.route("/event-registrationss").get(getEventRegistrationss).post(createEventRegistrations);
router.route("/event-registrationss/:id").get(getEventRegistrationsById).patch(updateEventRegistrations).delete(deleteEventRegistrations);

export default router;
