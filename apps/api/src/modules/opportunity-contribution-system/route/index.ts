import { Router } from "express";
import { createOpportunitySubmissions, getOpportunitySubmissionss, getOpportunitySubmissionsById, updateOpportunitySubmissions, deleteOpportunitySubmissions } from "../controller/opportunity-submissions.controller";
import { createOpportunitySubmissionReviews, getOpportunitySubmissionReviewss, getOpportunitySubmissionReviewsById, updateOpportunitySubmissionReviews, deleteOpportunitySubmissionReviews } from "../controller/opportunity-submission-reviews.controller";
import { createOpportunitySubmissionMessages, getOpportunitySubmissionMessagess, getOpportunitySubmissionMessagesById, updateOpportunitySubmissionMessages, deleteOpportunitySubmissionMessages } from "../controller/opportunity-submission-messages.controller";
import { createRewardTransactions, getRewardTransactionss, getRewardTransactionsById, updateRewardTransactions, deleteRewardTransactions } from "../controller/reward-transactions.controller";

const router: Router = Router();

// OpportunitySubmissionss
router.route("/opportunity-submissionss").get(getOpportunitySubmissionss).post(createOpportunitySubmissions);
router.route("/opportunity-submissionss/:id").get(getOpportunitySubmissionsById).patch(updateOpportunitySubmissions).delete(deleteOpportunitySubmissions);


// OpportunitySubmissionReviewss
router.route("/opportunity-submission-reviewss").get(getOpportunitySubmissionReviewss).post(createOpportunitySubmissionReviews);
router.route("/opportunity-submission-reviewss/:id").get(getOpportunitySubmissionReviewsById).patch(updateOpportunitySubmissionReviews).delete(deleteOpportunitySubmissionReviews);


// OpportunitySubmissionMessagess
router.route("/opportunity-submission-messagess").get(getOpportunitySubmissionMessagess).post(createOpportunitySubmissionMessages);
router.route("/opportunity-submission-messagess/:id").get(getOpportunitySubmissionMessagesById).patch(updateOpportunitySubmissionMessages).delete(deleteOpportunitySubmissionMessages);


// RewardTransactionss
router.route("/reward-transactionss").get(getRewardTransactionss).post(createRewardTransactions);
router.route("/reward-transactionss/:id").get(getRewardTransactionsById).patch(updateRewardTransactions).delete(deleteRewardTransactions);

export default router;
