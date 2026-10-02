import { BaseRepository } from "../../../core/base.repository";
import { CareerGoals } from "../model/career_goals.model";

export class CareerGoalsRepository extends BaseRepository<CareerGoals> {
    constructor() {
        super(CareerGoals);
    }
}
