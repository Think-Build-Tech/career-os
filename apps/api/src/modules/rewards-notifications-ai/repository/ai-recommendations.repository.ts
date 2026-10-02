import { BaseRepository } from "../../../core/base.repository";
import { AiRecommendations } from "../model/ai_recommendations.model";

export class AiRecommendationsRepository extends BaseRepository<AiRecommendations> {
    constructor() {
        super(AiRecommendations);
    }
}
