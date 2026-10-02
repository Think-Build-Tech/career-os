import { BaseService } from "../../../core/base.service";
import { AssessmentAttempts } from "../model/assessment_attempts.model";
import { AssessmentAttemptsRepository } from "../repository/assessment-attempts.repository";

export class AssessmentAttemptsService extends BaseService<AssessmentAttempts> {
    constructor() {
        super(new AssessmentAttemptsRepository());
    }
}
