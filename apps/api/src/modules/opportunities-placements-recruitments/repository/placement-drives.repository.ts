import { BaseRepository } from "../../../core/base.repository";
import { PlacementDrives } from "../model/placement_drives.model";

export class PlacementDrivesRepository extends BaseRepository<PlacementDrives> {
    constructor() {
        super(PlacementDrives);
    }
}
