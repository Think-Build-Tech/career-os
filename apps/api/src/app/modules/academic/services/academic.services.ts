import { Op, WhereOptions } from "sequelize";
import { CreateReadService, CrudService, MutableService } from "../../services";
import { AcademicEvent, StudentAcademicMembership, StudentAcademicRecord } from "../models";

// Academic records are append-only; corrections create a new effective record.
export class StudentAcademicRecordService extends CreateReadService<StudentAcademicRecord> {
  constructor() {
    super(StudentAcademicRecord);
  }
}

export class StudentAcademicMembershipService extends MutableService<StudentAcademicMembership> {
  constructor() {
    super(StudentAcademicMembership);
  }
}

export class AcademicEventService extends CrudService<AcademicEvent> {
  constructor() {
    super(AcademicEvent);
  }

  /**
   * Identifies academic timetable / exam conflicts within a specified time window.
   */
  async findConflictingEvents(params: {
    department_id?: string | null;
    program_id?: string | null;
    cohort_id?: string | null;
    starts_at: Date;
    ends_at: Date;
  }): Promise<AcademicEvent[]> {
    const scopeConditions: WhereOptions[] = [];

    if (params.cohort_id) {
      scopeConditions.push({ cohort_id: params.cohort_id });
    }
    if (params.program_id) {
      scopeConditions.push({ program_id: params.program_id });
    }
    if (params.department_id) {
      scopeConditions.push({ department_id: params.department_id });
    }
    // Also include institution-wide events (where all scope IDs are null)
    scopeConditions.push({
      department_id: null,
      program_id: null,
      cohort_id: null,
    });

    return this.model.findAll({
      where: {
        starts_at: { [Op.lt]: params.ends_at },
        ends_at: { [Op.gt]: params.starts_at },
        [Op.or]: scopeConditions,
      },
      order: [["starts_at", "ASC"]],
    });
  }
}

