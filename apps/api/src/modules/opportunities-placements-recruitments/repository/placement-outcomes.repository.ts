import { BaseRepository } from "../../../core/base.repository";
import { PlacementOutcomes } from "../model/placement_outcomes.model";

export class PlacementOutcomesRepository extends BaseRepository<PlacementOutcomes> {
    constructor() {
        super(PlacementOutcomes);
    }
}
