import { BaseRepository } from "../../../core/base.repository";
import { CareerRoadmaps } from "../model/career_roadmaps.model";

export class CareerRoadmapsRepository extends BaseRepository<CareerRoadmaps> {
    constructor() {
        super(CareerRoadmaps);
    }
}
