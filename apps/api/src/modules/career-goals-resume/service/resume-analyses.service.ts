import { BaseService } from "../../../core/base.service";
import { ResumeAnalyses } from "../model/resume_analyses.model";
import { ResumeAnalysesRepository } from "../repository/resume-analyses.repository";

export class ResumeAnalysesService extends BaseService<ResumeAnalyses> {
    constructor() {
        super(new ResumeAnalysesRepository());
    }
}
