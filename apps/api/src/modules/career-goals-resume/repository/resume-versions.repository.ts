import { BaseRepository } from "../../../core/base.repository";
import { ResumeVersions } from "../model/resume_versions.model";

export class ResumeVersionsRepository extends BaseRepository<ResumeVersions> {
    constructor() {
        super(ResumeVersions);
    }
}
