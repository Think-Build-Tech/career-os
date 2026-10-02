import { BaseRepository } from "../../../core/base.repository";
import { AssessmentQuestions } from "../model/assessment_questions.model";

export class AssessmentQuestionsRepository extends BaseRepository<AssessmentQuestions> {
    constructor() {
        super(AssessmentQuestions);
    }
}
