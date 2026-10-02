import { BaseService } from "../../../core/base.service";
import { CodingSubmissions } from "../model/coding_submissions.model";
import { CodingSubmissionsRepository } from "../repository/coding-submissions.repository";

export class CodingSubmissionsService extends BaseService<CodingSubmissions> {
    constructor() {
        super(new CodingSubmissionsRepository());
    }
}
