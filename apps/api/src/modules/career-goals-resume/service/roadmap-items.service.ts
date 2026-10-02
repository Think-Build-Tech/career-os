import { BaseService } from "../../../core/base.service";
import { RoadmapItems } from "../model/roadmap_items.model";
import { RoadmapItemsRepository } from "../repository/roadmap-items.repository";

export class RoadmapItemsService extends BaseService<RoadmapItems> {
    constructor() {
        super(new RoadmapItemsRepository());
    }
}
