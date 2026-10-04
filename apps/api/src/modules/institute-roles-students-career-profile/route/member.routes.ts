import { Router } from "express";
import {
    createStudentProfile,
    getStudentProfiles,
    getStudentProfileById,
    updateStudentProfile,
    deleteStudentProfile,
} from "../controller/member/student-profile.controller";
import {
    createAlumniProfile,
    getAlumniProfiles,
    getAlumniProfileById,
    updateAlumniProfile,
    deleteAlumniProfile,
} from "../controller/member/alumni-profile.controller";
import {
    createTpoProfile,
    getTpoProfiles,
    getTpoProfileById,
    updateTpoProfile,
    deleteTpoProfile,
} from "../controller/member/tpo-profile.controller";
import {
    createFacultyProfile,
    getFacultyProfiles,
    getFacultyProfileById,
    updateFacultyProfile,
    deleteFacultyProfile,
} from "../controller/member/faculty-profile.controller";
import {
    createMember,
    getMembers,
    getMemberById,
    updateMember,
    deleteMember,
    getPendingApprovals,
    approveMember,
    rejectMember,
} from "../controller/member/member.controller";
import {
    createMemberSkill,
    getMemberSkills,
    getMemberSkillById,
    updateMemberSkill,
    deleteMemberSkill,
} from "../controller/member/member-skill.controller";
import {
    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
} from "../controller/member/project.controller";
import {
    createProfessionalExperience,
    getProfessionalExperiences,
    getProfessionalExperienceById,
    updateProfessionalExperience,
    deleteProfessionalExperience,
} from "../controller/member/professional-experience.controller";
import {
    createCertification,
    getCertifications,
    getCertificationById,
    updateCertification,
    deleteCertification,
} from "../controller/member/certification.controller";
import {
    createMemberProfile,
    getMemberProfiles,
    getMemberProfileById,
    updateMemberProfile,
    deleteMemberProfile,
} from "../controller/member/member-profile.controller";

const router: Router = Router();

// Members - specific routes must go before /:id routes
router.route("/members/pending-approvals").get(getPendingApprovals);
router.route("/members/:id/approve").post(approveMember);
router.route("/members/:id/reject").post(rejectMember);

router.route("/members").get(getMembers).post(createMember);
router.route("/members/:id").get(getMemberById).patch(updateMember).delete(deleteMember);

// Member Profiles
router.route("/member-profiles").get(getMemberProfiles).post(createMemberProfile);
router.route("/member-profiles/:id").get(getMemberProfileById).patch(updateMemberProfile).delete(deleteMemberProfile);

// Student Profiles
router.route("/student-profiles").get(getStudentProfiles).post(createStudentProfile);
router.route("/student-profiles/:id").get(getStudentProfileById).patch(updateStudentProfile).delete(deleteStudentProfile);

// Alumni Profiles
router.route("/alumni-profiles").get(getAlumniProfiles).post(createAlumniProfile);
router.route("/alumni-profiles/:id").get(getAlumniProfileById).patch(updateAlumniProfile).delete(deleteAlumniProfile);

// TPO Profiles
router.route("/tpo-profiles").get(getTpoProfiles).post(createTpoProfile);
router.route("/tpo-profiles/:id").get(getTpoProfileById).patch(updateTpoProfile).delete(deleteTpoProfile);

// Faculty Profiles
router.route("/faculty-profiles").get(getFacultyProfiles).post(createFacultyProfile);
router.route("/faculty-profiles/:id").get(getFacultyProfileById).patch(updateFacultyProfile).delete(deleteFacultyProfile);

// Member Skills
router.route("/member-skills").get(getMemberSkills).post(createMemberSkill);
router.route("/member-skills/:id").get(getMemberSkillById).patch(updateMemberSkill).delete(deleteMemberSkill);

// Projects
router.route("/projects").get(getProjects).post(createProject);
router.route("/projects/:id").get(getProjectById).patch(updateProject).delete(deleteProject);

// Professional Experiences
router.route("/experiences").get(getProfessionalExperiences).post(createProfessionalExperience);
router.route("/experiences/:id").get(getProfessionalExperienceById).patch(updateProfessionalExperience).delete(deleteProfessionalExperience);

// Certifications
router.route("/certifications").get(getCertifications).post(createCertification);
router.route("/certifications/:id").get(getCertificationById).patch(updateCertification).delete(deleteCertification);

export default router;
