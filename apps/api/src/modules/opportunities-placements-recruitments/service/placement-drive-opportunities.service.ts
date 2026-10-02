import { BaseService } from "../../../core/base.service";
import { PlacementDriveOpportunities } from "../model/placement_drive_opportunities.model";
import { PlacementDriveOpportunitiesRepository } from "../repository/placement-drive-opportunities.repository";

export class PlacementDriveOpportunitiesService extends BaseService<PlacementDriveOpportunities> {
    constructor() {
        super(new PlacementDriveOpportunitiesRepository());
    }
}
