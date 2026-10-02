import { createResourceHandlers } from "../../../core/controller.utils";
import { AiRecommendations } from "../model/ai_recommendations.model";
import { AiRecommendationsService } from "../service/ai-recommendations.service";

const service = new AiRecommendationsService();
const handlers = createResourceHandlers<AiRecommendations>(service);

export const createAiRecommendations = handlers.create;
export const getAiRecommendationss = handlers.getAll;
export const getAiRecommendationsById = handlers.getById;
export const updateAiRecommendations = handlers.update;
export const deleteAiRecommendations = handlers.delete;
