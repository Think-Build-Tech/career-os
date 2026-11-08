import { CreateReadService, MutableService } from "../../services";
import { StudentReputationEvent, StudentReputationSummary } from "../models";

export class StudentReputationEventService extends CreateReadService<StudentReputationEvent> {
  constructor() { super(StudentReputationEvent); }
}

export class StudentReputationSummaryService extends MutableService<StudentReputationSummary> {
  constructor() { super(StudentReputationSummary); }
}
