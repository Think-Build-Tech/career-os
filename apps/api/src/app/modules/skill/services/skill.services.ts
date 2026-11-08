import { CrudService, MutableService } from "../../services";
import { Skill, SkillEvidence, StudentSkill } from "../models";

export class SkillService extends CrudService<Skill> {
  constructor() { super(Skill); }
}

export class StudentSkillService extends CrudService<StudentSkill> {
  constructor() { super(StudentSkill); }
}

export class SkillEvidenceService extends MutableService<SkillEvidence> {
  constructor() { super(SkillEvidence); }
}
