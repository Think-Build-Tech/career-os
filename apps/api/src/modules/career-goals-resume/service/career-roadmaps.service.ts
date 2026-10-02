import { BaseService } from "../../../core/base.service";
import { CareerRoadmaps } from "../model/career_roadmaps.model";
import { CareerRoadmapsRepository } from "../repository/career-roadmaps.repository";

export class CareerRoadmapsService extends BaseService<CareerRoadmaps> {
    constructor() {
        super(new CareerRoadmapsRepository());
    }
}
