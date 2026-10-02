import { BaseService } from "../../../core/base.service";
import { AiRecommendations } from "../model/ai_recommendations.model";
import { AiRecommendationsRepository } from "../repository/ai-recommendations.repository";

export class AiRecommendationsService extends BaseService<AiRecommendations> {
    constructor() {
        super(new AiRecommendationsRepository());
    }
}
