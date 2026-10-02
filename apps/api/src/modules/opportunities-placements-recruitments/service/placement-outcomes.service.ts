import { BaseService } from "../../../core/base.service";
import { PlacementOutcomes } from "../model/placement_outcomes.model";
import { PlacementOutcomesRepository } from "../repository/placement-outcomes.repository";

export class PlacementOutcomesService extends BaseService<PlacementOutcomes> {
    constructor() {
        super(new PlacementOutcomesRepository());
    }
}
