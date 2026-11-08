import { Request, Response } from "express";
import {
  KnowledgeDocumentService,
  KnowledgeChunkService,
  KnowledgeEmbeddingService,
  KnowledgeIngestionJobService,
} from "./services";

const docService = new KnowledgeDocumentService();
const chunkService = new KnowledgeChunkService();
const embeddingService = new KnowledgeEmbeddingService();
const jobService = new KnowledgeIngestionJobService();

// Documents
export async function getAllDocuments(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const documents = await docService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      documents,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function getDocumentById(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide document ID",
      });
    }

    const document = await docService.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Knowledge document not found",
      });
    }

    return res.status(200).json({
      success: true,
      document,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createDocument(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.source_type || !data.source_id || !data.title || !data.content_hash || !data.visibility_scope_type) {
      return res.status(400).json({
        success: false,
        message: "source_type, source_id, title, content_hash, and visibility_scope_type are required",
      });
    }

    const document = await docService.create(data);
    return res.status(201).json({
      success: true,
      document,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function updateDocument(req: Request, res: Response) {
  try {
    const id = req.params['id'] as string;
    const data = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Please provide document ID",
      });
    }

    const document = await docService.updateById(id, data);
    return res.status(200).json({
      success: true,
      document,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Chunks
export async function getAllChunks(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const chunks = await chunkService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      chunks,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createChunk(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.knowledge_document_id || data.chunk_index === undefined || !data.content) {
      return res.status(400).json({
        success: false,
        message: "knowledge_document_id, chunk_index, and content are required",
      });
    }

    const chunk = await chunkService.create(data);
    return res.status(201).json({
      success: true,
      chunk,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Embeddings
export async function createEmbedding(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.chunk_id || !data.model_name || !data.embedding) {
      return res.status(400).json({
        success: false,
        message: "chunk_id, model_name, and embedding are required",
      });
    }

    const embedding = await embeddingService.create(data);
    return res.status(201).json({
      success: true,
      embedding,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

// Ingestion Jobs
export async function getAllIngestionJobs(req: Request, res: Response) {
  try {
    const page = Number(req.query['page']) || 1;
    const limit = Number(req.query['limit']) || 20;
    const jobs = await jobService.paginate({ page, limit });
    return res.status(200).json({
      success: true,
      jobs,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}

export async function createIngestionJob(req: Request, res: Response) {
  try {
    const data = req.body;
    if (!data.knowledge_document_id) {
      return res.status(400).json({
        success: false,
        message: "knowledge_document_id is required",
      });
    }

    const job = await jobService.create(data);
    return res.status(201).json({
      success: true,
      job,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || err,
      message: "Internal Server Error",
    });
  }
}
