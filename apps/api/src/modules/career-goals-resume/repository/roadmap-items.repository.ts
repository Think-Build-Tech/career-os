import { BaseRepository } from "../../../core/base.repository";
import { RoadmapItems } from "../model/roadmap_items.model";

export class RoadmapItemsRepository extends BaseRepository<RoadmapItems> {
    constructor() {
        super(RoadmapItems);
    }
}
