import { Router } from "express";
import memberRoutes from "./member.routes";
import academicRoutes from "./academic.routes";
import accessRoutes from "./access.routes";

const instituteRoutes: Router = Router();

instituteRoutes.use(memberRoutes);
instituteRoutes.use(academicRoutes);
instituteRoutes.use(accessRoutes);

export default instituteRoutes;
