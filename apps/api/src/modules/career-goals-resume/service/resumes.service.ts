import { BaseService } from "../../../core/base.service";
import { Resumes } from "../model/resumes.model";
import { ResumesRepository } from "../repository/resumes.repository";

export class ResumesService extends BaseService<Resumes> {
    constructor() {
        super(new ResumesRepository());
    }
}
