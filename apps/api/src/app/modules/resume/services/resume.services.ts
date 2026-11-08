import { CreateReadService, CrudService } from "../../services";
import { Resume, ResumeVersion } from "../models";

export class ResumeService extends CrudService<Resume> {
  constructor() { super(Resume); }
}

// Resume versions must never be overwritten or deleted.
export class ResumeVersionService extends CreateReadService<ResumeVersion> {
  constructor() { super(ResumeVersion); }
}
