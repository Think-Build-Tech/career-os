import { BaseRepository } from "../../../core/base.repository";
import { AssessmentAttempts } from "../model/assessment_attempts.model";

export class AssessmentAttemptsRepository extends BaseRepository<AssessmentAttempts> {
    constructor() {
        super(AssessmentAttempts);
    }
}
