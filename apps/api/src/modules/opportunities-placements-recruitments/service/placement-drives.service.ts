import { BaseService } from "../../../core/base.service";
import { PlacementDrives } from "../model/placement_drives.model";
import { PlacementDrivesRepository } from "../repository/placement-drives.repository";

export class PlacementDrivesService extends BaseService<PlacementDrives> {
    constructor() {
        super(new PlacementDrivesRepository());
    }
}
