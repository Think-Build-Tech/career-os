import { BaseService } from "../../../core/base.service";
import { AssessmentResponses } from "../model/assessment_responses.model";
import { AssessmentResponsesRepository } from "../repository/assessment-responses.repository";

export class AssessmentResponsesService extends BaseService<AssessmentResponses> {
    constructor() {
        super(new AssessmentResponsesRepository());
    }
}
