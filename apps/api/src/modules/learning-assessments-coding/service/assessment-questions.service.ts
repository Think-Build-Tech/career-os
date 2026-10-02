import { BaseService } from "../../../core/base.service";
import { AssessmentQuestions } from "../model/assessment_questions.model";
import { AssessmentQuestionsRepository } from "../repository/assessment-questions.repository";

export class AssessmentQuestionsService extends BaseService<AssessmentQuestions> {
    constructor() {
        super(new AssessmentQuestionsRepository());
    }
}
