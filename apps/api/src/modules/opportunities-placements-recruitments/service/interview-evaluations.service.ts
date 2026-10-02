import { BaseService } from "../../../core/base.service";
import { InterviewEvaluations } from "../model/interview_evaluations.model";
import { InterviewEvaluationsRepository } from "../repository/interview-evaluations.repository";

export class InterviewEvaluationsService extends BaseService<InterviewEvaluations> {
    constructor() {
        super(new InterviewEvaluationsRepository());
    }
}
