import { BaseRepository } from "../../../core/base.repository";
import { AssessmentResponses } from "../model/assessment_responses.model";

export class AssessmentResponsesRepository extends BaseRepository<AssessmentResponses> {
    constructor() {
        super(AssessmentResponses);
    }
}
