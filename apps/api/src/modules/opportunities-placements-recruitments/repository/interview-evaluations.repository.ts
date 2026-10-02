import { BaseRepository } from "../../../core/base.repository";
import { InterviewEvaluations } from "../model/interview_evaluations.model";

export class InterviewEvaluationsRepository extends BaseRepository<InterviewEvaluations> {
    constructor() {
        super(InterviewEvaluations);
    }
}
