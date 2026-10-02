import { BaseRepository } from "../../../core/base.repository";
import { InterviewQuestions } from "../model/interview_questions.model";

export class InterviewQuestionsRepository extends BaseRepository<InterviewQuestions> {
    constructor() {
        super(InterviewQuestions);
    }
}
