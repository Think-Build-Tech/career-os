import { Router } from "express";
import {
  getAllConnections,
  getConnectionById,
  createConnection,
  updateConnection,
  deleteConnection,
  getAllSyncJobs,
  createSyncJob,
  getAllMappings,
  createMapping,
} from "./integration.controller";

export const integrationRouter = Router();

// Connections
integrationRouter.get("/connections", getAllConnections);
integrationRouter.post("/connections", createConnection);
integrationRouter.get("/connections/:id", getConnectionById);
integrationRouter.put("/connections/:id", updateConnection);
integrationRouter.delete("/connections/:id", deleteConnection);

// Sync Jobs
integrationRouter.get("/sync-jobs", getAllSyncJobs);
integrationRouter.post("/sync-jobs", createSyncJob);

// Mappings
integrationRouter.get("/mappings", getAllMappings);
integrationRouter.post("/mappings", createMapping);

