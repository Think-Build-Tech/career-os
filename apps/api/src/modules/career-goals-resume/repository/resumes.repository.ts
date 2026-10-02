import { BaseRepository } from "../../../core/base.repository";
import { Resumes } from "../model/resumes.model";

export class ResumesRepository extends BaseRepository<Resumes> {
    constructor() {
        super(Resumes);
    }
}
