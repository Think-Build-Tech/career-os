import { BaseService } from "../../../core/base.service";
import { Assessments } from "../model/assessments.model";
import { AssessmentsRepository } from "../repository/assessments.repository";

export class AssessmentsService extends BaseService<Assessments> {
    constructor() {
        super(new AssessmentsRepository());
    }
}
