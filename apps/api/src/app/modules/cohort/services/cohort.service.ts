import { CrudService } from "../../services";
import Cohort from "../cohort.model";

export class CohortService extends CrudService<Cohort> {
  constructor() {
    super(Cohort);
  }
}

export default CohortService;
