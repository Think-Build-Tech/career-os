import { Router } from "express";
import memberRoutes from "./member.routes";
import academicRoutes from "./academic.routes";
import accessRoutes from "./access.routes";
import placementRoutes from "./placement.routes";
import assessmentRoutes from "./assessment.routes";
import careerRoutes from "./career.routes";
import contributionRoutes from "./contribution.routes";

const instituteRoutes: Router = Router();

instituteRoutes.use(memberRoutes);
instituteRoutes.use(academicRoutes);
instituteRoutes.use(accessRoutes);
instituteRoutes.use(placementRoutes);
instituteRoutes.use(assessmentRoutes);
instituteRoutes.use(careerRoutes);
instituteRoutes.use(contributionRoutes);

export default instituteRoutes;
