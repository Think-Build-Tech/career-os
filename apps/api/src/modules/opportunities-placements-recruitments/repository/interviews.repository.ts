import { BaseRepository } from "../../../core/base.repository";
import { Interviews } from "../model/interviews.model";

export class InterviewsRepository extends BaseRepository<Interviews> {
    constructor() {
        super(Interviews);
    }
}
