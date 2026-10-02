import { BaseService } from "../../../core/base.service";
import { CareerGoals } from "../model/career_goals.model";
import { CareerGoalsRepository } from "../repository/career-goals.repository";

export class CareerGoalsService extends BaseService<CareerGoals> {
    constructor() {
        super(new CareerGoalsRepository());
    }
}
