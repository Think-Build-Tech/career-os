import { Router } from "express";
import { createLearningResources, getLearningResourcess, getLearningResourcesById, updateLearningResources, deleteLearningResources } from "../controller/learning-resources.controller";
import { createResourceSkills, getResourceSkillss, getResourceSkillsById, updateResourceSkills, deleteResourceSkills } from "../controller/resource-skills.controller";
import { createResourceProgress, getResourceProgresss, getResourceProgressById, updateResourceProgress, deleteResourceProgress } from "../controller/resource-progress.controller";
import { createAssessments, getAssessmentss, getAssessmentsById, updateAssessments, deleteAssessments } from "../controller/assessments.controller";
import { createAssessmentQuestions, getAssessmentQuestionss, getAssessmentQuestionsById, updateAssessmentQuestions, deleteAssessmentQuestions } from "../controller/assessment-questions.controller";
import { createAssessmentAttempts, getAssessmentAttemptss, getAssessmentAttemptsById, updateAssessmentAttempts, deleteAssessmentAttempts } from "../controller/assessment-attempts.controller";
import { createAssessmentResponses, getAssessmentResponsess, getAssessmentResponsesById, updateAssessmentResponses, deleteAssessmentResponses } from "../controller/assessment-responses.controller";
import { createCodingProblems, getCodingProblemss, getCodingProblemsById, updateCodingProblems, deleteCodingProblems } from "../controller/coding-problems.controller";
import { createCodingTestCases, getCodingTestCasess, getCodingTestCasesById, updateCodingTestCases, deleteCodingTestCases } from "../controller/coding-test-cases.controller";
import { createCodingSubmissions, getCodingSubmissionss, getCodingSubmissionsById, updateCodingSubmissions, deleteCodingSubmissions } from "../controller/coding-submissions.controller";

const router: Router = Router();

// LearningResourcess
router.route("/learning-resourcess").get(getLearningResourcess).post(createLearningResources);
router.route("/learning-resourcess/:id").get(getLearningResourcesById).patch(updateLearningResources).delete(deleteLearningResources);


// ResourceSkillss
router.route("/resource-skillss").get(getResourceSkillss).post(createResourceSkills);
router.route("/resource-skillss/:id").get(getResourceSkillsById).patch(updateResourceSkills).delete(deleteResourceSkills);


// ResourceProgresss
router.route("/resource-progresss").get(getResourceProgresss).post(createResourceProgress);
router.route("/resource-progresss/:id").get(getResourceProgressById).patch(updateResourceProgress).delete(deleteResourceProgress);


// Assessmentss
router.route("/assessmentss").get(getAssessmentss).post(createAssessments);
router.route("/assessmentss/:id").get(getAssessmentsById).patch(updateAssessments).delete(deleteAssessments);


// AssessmentQuestionss
router.route("/assessment-questionss").get(getAssessmentQuestionss).post(createAssessmentQuestions);
router.route("/assessment-questionss/:id").get(getAssessmentQuestionsById).patch(updateAssessmentQuestions).delete(deleteAssessmentQuestions);


// AssessmentAttemptss
router.route("/assessment-attemptss").get(getAssessmentAttemptss).post(createAssessmentAttempts);
router.route("/assessment-attemptss/:id").get(getAssessmentAttemptsById).patch(updateAssessmentAttempts).delete(deleteAssessmentAttempts);


// AssessmentResponsess
router.route("/assessment-responsess").get(getAssessmentResponsess).post(createAssessmentResponses);
router.route("/assessment-responsess/:id").get(getAssessmentResponsesById).patch(updateAssessmentResponses).delete(deleteAssessmentResponses);


// CodingProblemss
router.route("/coding-problemss").get(getCodingProblemss).post(createCodingProblems);
router.route("/coding-problemss/:id").get(getCodingProblemsById).patch(updateCodingProblems).delete(deleteCodingProblems);


// CodingTestCasess
router.route("/coding-test-casess").get(getCodingTestCasess).post(createCodingTestCases);
router.route("/coding-test-casess/:id").get(getCodingTestCasesById).patch(updateCodingTestCases).delete(deleteCodingTestCases);


// CodingSubmissionss
router.route("/coding-submissionss").get(getCodingSubmissionss).post(createCodingSubmissions);
router.route("/coding-submissionss/:id").get(getCodingSubmissionsById).patch(updateCodingSubmissions).delete(deleteCodingSubmissions);

export default router;
