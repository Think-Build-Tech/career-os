import { BaseService } from "../../../core/base.service";
import { Interviews } from "../model/interviews.model";
import { InterviewsRepository } from "../repository/interviews.repository";

export class InterviewsService extends BaseService<Interviews> {
    constructor() {
        super(new InterviewsRepository());
    }
}
