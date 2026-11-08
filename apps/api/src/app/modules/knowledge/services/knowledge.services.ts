import { CreateReadService, MutableService } from "../../services";
import {
  KnowledgeChunk,
  KnowledgeDocument,
  KnowledgeEmbedding,
  KnowledgeIngestionJob,
} from "../models";

export class KnowledgeDocumentService extends MutableService<KnowledgeDocument> {
  constructor() { super(KnowledgeDocument); }
}
export class KnowledgeChunkService extends CreateReadService<KnowledgeChunk> {
  constructor() { super(KnowledgeChunk); }
}
export class KnowledgeEmbeddingService extends CreateReadService<KnowledgeEmbedding> {
  constructor() { super(KnowledgeEmbedding); }
}
export class KnowledgeIngestionJobService extends MutableService<KnowledgeIngestionJob> {
  constructor() { super(KnowledgeIngestionJob); }
}
