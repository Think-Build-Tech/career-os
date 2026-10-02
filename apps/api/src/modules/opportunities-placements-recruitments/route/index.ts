import { Router } from "express";
import { createInstituteCompanies, getInstituteCompaniess, getInstituteCompaniesById, updateInstituteCompanies, deleteInstituteCompanies } from "../controller/institute-companies.controller";
import { createRecruiterProfiles, getRecruiterProfiless, getRecruiterProfilesById, updateRecruiterProfiles, deleteRecruiterProfiles } from "../controller/recruiter-profiles.controller";
import { createOpportunities, getOpportunitiess, getOpportunitiesById, updateOpportunities, deleteOpportunities } from "../controller/opportunities.controller";
import { createOpportunitySkills, getOpportunitySkillss, getOpportunitySkillsById, updateOpportunitySkills, deleteOpportunitySkills } from "../controller/opportunity-skills.controller";
import { createEligibilityRuleSets, getEligibilityRuleSetss, getEligibilityRuleSetsById, updateEligibilityRuleSets, deleteEligibilityRuleSets } from "../controller/eligibility-rule-sets.controller";
import { createEligibilityRuleGroups, getEligibilityRuleGroupss, getEligibilityRuleGroupsById, updateEligibilityRuleGroups, deleteEligibilityRuleGroups } from "../controller/eligibility-rule-groups.controller";
import { createEligibilityRules, getEligibilityRuless, getEligibilityRulesById, updateEligibilityRules, deleteEligibilityRules } from "../controller/eligibility-rules.controller";
import { createEligibilityResults, getEligibilityResultss, getEligibilityResultsById, updateEligibilityResults, deleteEligibilityResults } from "../controller/eligibility-results.controller";
import { createPlacementDrives, getPlacementDrivess, getPlacementDrivesById, updatePlacementDrives, deletePlacementDrives } from "../controller/placement-drives.controller";
import { createPlacementDriveOpportunities, getPlacementDriveOpportunitiess, getPlacementDriveOpportunitiesById, updatePlacementDriveOpportunities, deletePlacementDriveOpportunities } from "../controller/placement-drive-opportunities.controller";
import { createRecruitmentRounds, getRecruitmentRoundss, getRecruitmentRoundsById, updateRecruitmentRounds, deleteRecruitmentRounds } from "../controller/recruitment-rounds.controller";
import { createApplications, getApplicationss, getApplicationsById, updateApplications, deleteApplications } from "../controller/applications.controller";
import { createApplicationStatusHistory, getApplicationStatusHistorys, getApplicationStatusHistoryById, updateApplicationStatusHistory, deleteApplicationStatusHistory } from "../controller/application-status-history.controller";
import { createApplicationRoundProgress, getApplicationRoundProgresss, getApplicationRoundProgressById, updateApplicationRoundProgress, deleteApplicationRoundProgress } from "../controller/application-round-progress.controller";
import { createInterviews, getInterviewss, getInterviewsById, updateInterviews, deleteInterviews } from "../controller/interviews.controller";
import { createInterviewEvaluations, getInterviewEvaluationss, getInterviewEvaluationsById, updateInterviewEvaluations, deleteInterviewEvaluations } from "../controller/interview-evaluations.controller";
import { createOffers, getOfferss, getOffersById, updateOffers, deleteOffers } from "../controller/offers.controller";
import { createPlacementOutcomes, getPlacementOutcomess, getPlacementOutcomesById, updatePlacementOutcomes, deletePlacementOutcomes } from "../controller/placement-outcomes.controller";

const router: Router = Router();

// InstituteCompaniess
router.route("/institute-companiess").get(getInstituteCompaniess).post(createInstituteCompanies);
router.route("/institute-companiess/:id").get(getInstituteCompaniesById).patch(updateInstituteCompanies).delete(deleteInstituteCompanies);


// RecruiterProfiless
router.route("/recruiter-profiless").get(getRecruiterProfiless).post(createRecruiterProfiles);
router.route("/recruiter-profiless/:id").get(getRecruiterProfilesById).patch(updateRecruiterProfiles).delete(deleteRecruiterProfiles);


// Opportunitiess
router.route("/opportunitiess").get(getOpportunitiess).post(createOpportunities);
router.route("/opportunitiess/:id").get(getOpportunitiesById).patch(updateOpportunities).delete(deleteOpportunities);


// OpportunitySkillss
router.route("/opportunity-skillss").get(getOpportunitySkillss).post(createOpportunitySkills);
router.route("/opportunity-skillss/:id").get(getOpportunitySkillsById).patch(updateOpportunitySkills).delete(deleteOpportunitySkills);


// EligibilityRuleSetss
router.route("/eligibility-rule-setss").get(getEligibilityRuleSetss).post(createEligibilityRuleSets);
router.route("/eligibility-rule-setss/:id").get(getEligibilityRuleSetsById).patch(updateEligibilityRuleSets).delete(deleteEligibilityRuleSets);


// EligibilityRuleGroupss
router.route("/eligibility-rule-groupss").get(getEligibilityRuleGroupss).post(createEligibilityRuleGroups);
router.route("/eligibility-rule-groupss/:id").get(getEligibilityRuleGroupsById).patch(updateEligibilityRuleGroups).delete(deleteEligibilityRuleGroups);


// EligibilityRuless
router.route("/eligibility-ruless").get(getEligibilityRuless).post(createEligibilityRules);
router.route("/eligibility-ruless/:id").get(getEligibilityRulesById).patch(updateEligibilityRules).delete(deleteEligibilityRules);


// EligibilityResultss
router.route("/eligibility-resultss").get(getEligibilityResultss).post(createEligibilityResults);
router.route("/eligibility-resultss/:id").get(getEligibilityResultsById).patch(updateEligibilityResults).delete(deleteEligibilityResults);


// PlacementDrivess
router.route("/placement-drivess").get(getPlacementDrivess).post(createPlacementDrives);
router.route("/placement-drivess/:id").get(getPlacementDrivesById).patch(updatePlacementDrives).delete(deletePlacementDrives);


// PlacementDriveOpportunitiess
router.route("/placement-drive-opportunitiess").get(getPlacementDriveOpportunitiess).post(createPlacementDriveOpportunities);
router.route("/placement-drive-opportunitiess/:id").get(getPlacementDriveOpportunitiesById).patch(updatePlacementDriveOpportunities).delete(deletePlacementDriveOpportunities);


// RecruitmentRoundss
router.route("/recruitment-roundss").get(getRecruitmentRoundss).post(createRecruitmentRounds);
router.route("/recruitment-roundss/:id").get(getRecruitmentRoundsById).patch(updateRecruitmentRounds).delete(deleteRecruitmentRounds);


// Applicationss
router.route("/applicationss").get(getApplicationss).post(createApplications);
router.route("/applicationss/:id").get(getApplicationsById).patch(updateApplications).delete(deleteApplications);


// ApplicationStatusHistorys
router.route("/application-status-historys").get(getApplicationStatusHistorys).post(createApplicationStatusHistory);
router.route("/application-status-historys/:id").get(getApplicationStatusHistoryById).patch(updateApplicationStatusHistory).delete(deleteApplicationStatusHistory);


// ApplicationRoundProgresss
router.route("/application-round-progresss").get(getApplicationRoundProgresss).post(createApplicationRoundProgress);
router.route("/application-round-progresss/:id").get(getApplicationRoundProgressById).patch(updateApplicationRoundProgress).delete(deleteApplicationRoundProgress);


// Interviewss
router.route("/interviewss").get(getInterviewss).post(createInterviews);
router.route("/interviewss/:id").get(getInterviewsById).patch(updateInterviews).delete(deleteInterviews);


// InterviewEvaluationss
router.route("/interview-evaluationss").get(getInterviewEvaluationss).post(createInterviewEvaluations);
router.route("/interview-evaluationss/:id").get(getInterviewEvaluationsById).patch(updateInterviewEvaluations).delete(deleteInterviewEvaluations);


// Offerss
router.route("/offerss").get(getOfferss).post(createOffers);
router.route("/offerss/:id").get(getOffersById).patch(updateOffers).delete(deleteOffers);


// PlacementOutcomess
router.route("/placement-outcomess").get(getPlacementOutcomess).post(createPlacementOutcomes);
router.route("/placement-outcomess/:id").get(getPlacementOutcomesById).patch(updatePlacementOutcomes).delete(deletePlacementOutcomes);







export default router;
