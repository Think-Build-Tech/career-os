import { BaseService } from "../../../core/base.service";
import { Opportunities } from "../model/opportunities.model";
import { OpportunitiesRepository } from "../repository/opportunities.repository";

export class OpportunitiesService extends BaseService<Opportunities> {
    constructor() {
        super(new OpportunitiesRepository());
    }
}
