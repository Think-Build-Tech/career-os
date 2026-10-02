import { BaseRepository } from "../../../core/base.repository";
import { PlacementDriveOpportunities } from "../model/placement_drive_opportunities.model";

export class PlacementDriveOpportunitiesRepository extends BaseRepository<PlacementDriveOpportunities> {
    constructor() {
        super(PlacementDriveOpportunities);
    }
}
