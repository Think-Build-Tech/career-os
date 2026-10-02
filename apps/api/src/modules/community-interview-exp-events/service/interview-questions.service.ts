import { BaseService } from "../../../core/base.service";
import { InterviewQuestions } from "../model/interview_questions.model";
import { InterviewQuestionsRepository } from "../repository/interview-questions.repository";

export class InterviewQuestionsService extends BaseService<InterviewQuestions> {
    constructor() {
        super(new InterviewQuestionsRepository());
    }
}
