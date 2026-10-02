import { BaseService } from "../../../core/base.service";
import { ResumeVersions } from "../model/resume_versions.model";
import { ResumeVersionsRepository } from "../repository/resume-versions.repository";

export class ResumeVersionsService extends BaseService<ResumeVersions> {
    constructor() {
        super(new ResumeVersionsRepository());
    }
}
