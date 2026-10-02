import { BaseRepository } from "../../../core/base.repository";
import { CodingSubmissions } from "../model/coding_submissions.model";

export class CodingSubmissionsRepository extends BaseRepository<CodingSubmissions> {
    constructor() {
        super(CodingSubmissions);
    }
}
