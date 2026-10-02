import { BaseRepository } from "../../../core/base.repository";
import { Opportunities } from "../model/opportunities.model";

export class OpportunitiesRepository extends BaseRepository<Opportunities> {
    constructor() {
        super(Opportunities);
    }
}
