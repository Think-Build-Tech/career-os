import { BaseRepository } from "../../../core/base.repository";
import { Assessments } from "../model/assessments.model";

export class AssessmentsRepository extends BaseRepository<Assessments> {
    constructor() {
        super(Assessments);
    }
}
