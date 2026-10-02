import { BaseRepository } from "../../../core/base.repository";
import { ResumeAnalyses } from "../model/resume_analyses.model";

export class ResumeAnalysesRepository extends BaseRepository<ResumeAnalyses> {
    constructor() {
        super(ResumeAnalyses);
    }
}
