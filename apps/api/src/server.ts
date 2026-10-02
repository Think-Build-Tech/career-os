import bodyParser from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import {Request, Response} from "express";
import identityRoutes from "./modules/control-plane-identity/route";
import instituteRoutes from "./modules/institute-roles-students-career-profile/route";
import "./modules/control-plane-identity";

import alumniRoutes from "./modules/alumni-mentorship-referral/route";
import communityRoutes from "./modules/community-interview-exp-events/route";
import learningRoutes from "./modules/learning-assessments-coding/route";
import opportunitiesRoutes from "./modules/opportunities-placements-recruitments/route";
import careerRoutes from "./modules/career-goals-resume/route";
import contributionRoutes from "./modules/opportunity-contribution-system/route";
import rewardsRoutes from "./modules/rewards-notifications-ai/route";

const { json, urlencoded } = bodyParser;

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors())
    .use("/api/control-plane-identity", identityRoutes)
    .use("/api/institute", instituteRoutes)
    .use("/api/alumni-mentorship-referral", alumniRoutes)
    .use("/api/community-interview-exp-events", communityRoutes)
    .use("/api/learning-assessments-coding", learningRoutes)
    .use("/api/opportunities-placements-recruitments", opportunitiesRoutes)
    .use("/api/career-goals-resume", careerRoutes)
    .use("/api/opportunity-contribution-system", contributionRoutes)
    .use("/api/rewards-notifications-ai", rewardsRoutes)
    .get("/message/:name", (req: Request, res: Response) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_: any, res: Response) => {
      return res.json({ ok: true });
    });

  return app;
};
