import { Router } from "express";
import {
  getAllDocuments,
  getDocumentById,
  createDocument,
  updateDocument,
  getAllChunks,
  createChunk,
  createEmbedding,
  getAllIngestionJobs,
  createIngestionJob,
} from "./knowledge.controller";

export const knowledgeRouter = Router();

// Documents
knowledgeRouter.get("/documents", getAllDocuments);
knowledgeRouter.post("/documents", createDocument);
knowledgeRouter.get("/documents/:id", getDocumentById);
knowledgeRouter.put("/documents/:id", updateDocument);

// Chunks
knowledgeRouter.get("/chunks", getAllChunks);
knowledgeRouter.post("/chunks", createChunk);

// Embeddings
knowledgeRouter.post("/embeddings", createEmbedding);

// Ingestion Jobs
knowledgeRouter.get("/jobs", getAllIngestionJobs);
knowledgeRouter.post("/jobs", createIngestionJob);

