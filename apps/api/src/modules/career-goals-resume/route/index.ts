import { Router } from "express";
import { createCareerGoals, getCareerGoalss, getCareerGoalsById, updateCareerGoals, deleteCareerGoals } from "../controller/career-goals.controller";
import { createCareerRoadmaps, getCareerRoadmapss, getCareerRoadmapsById, updateCareerRoadmaps, deleteCareerRoadmaps } from "../controller/career-roadmaps.controller";
import { createRoadmapItems, getRoadmapItemss, getRoadmapItemsById, updateRoadmapItems, deleteRoadmapItems } from "../controller/roadmap-items.controller";
import { createResumes, getResumess, getResumesById, updateResumes, deleteResumes } from "../controller/resumes.controller";
import { createResumeVersions, getResumeVersionss, getResumeVersionsById, updateResumeVersions, deleteResumeVersions } from "../controller/resume-versions.controller";
import { createResumeAnalyses, getResumeAnalysess, getResumeAnalysesById, updateResumeAnalyses, deleteResumeAnalyses } from "../controller/resume-analyses.controller";
import { createFileObjects, getFileObjectss, getFileObjectsById, updateFileObjects, deleteFileObjects } from "../controller/file-objects.controller";

const router: Router = Router();

// CareerGoalss
router.route("/career-goalss").get(getCareerGoalss).post(createCareerGoals);
router.route("/career-goalss/:id").get(getCareerGoalsById).patch(updateCareerGoals).delete(deleteCareerGoals);


// CareerRoadmapss
router.route("/career-roadmapss").get(getCareerRoadmapss).post(createCareerRoadmaps);
router.route("/career-roadmapss/:id").get(getCareerRoadmapsById).patch(updateCareerRoadmaps).delete(deleteCareerRoadmaps);


// RoadmapItemss
router.route("/roadmap-itemss").get(getRoadmapItemss).post(createRoadmapItems);
router.route("/roadmap-itemss/:id").get(getRoadmapItemsById).patch(updateRoadmapItems).delete(deleteRoadmapItems);


// Resumess
router.route("/resumess").get(getResumess).post(createResumes);
router.route("/resumess/:id").get(getResumesById).patch(updateResumes).delete(deleteResumes);


// ResumeVersionss
router.route("/resume-versionss").get(getResumeVersionss).post(createResumeVersions);
router.route("/resume-versionss/:id").get(getResumeVersionsById).patch(updateResumeVersions).delete(deleteResumeVersions);


// ResumeAnalysess
router.route("/resume-analysess").get(getResumeAnalysess).post(createResumeAnalyses);
router.route("/resume-analysess/:id").get(getResumeAnalysesById).patch(updateResumeAnalyses).delete(deleteResumeAnalyses);


// FileObjectss
router.route("/file-objectss").get(getFileObjectss).post(createFileObjects);
router.route("/file-objectss/:id").get(getFileObjectsById).patch(updateFileObjects).delete(deleteFileObjects);

export default router;
