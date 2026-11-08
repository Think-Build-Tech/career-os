import { CreateReadService, CrudService } from "../../services";
import {
  Company,
  CompanyContact,
  CrmActivity,
  CrmPipeline,
  RecruiterProfile,
  RecruitmentVisit,
} from "../models";

export class CompanyService extends CrudService<Company> {
  constructor() { super(Company); }
}
export class CompanyContactService extends CrudService<CompanyContact> {
  constructor() { super(CompanyContact); }
}
export class RecruiterProfileService extends CrudService<RecruiterProfile> {
  constructor() { super(RecruiterProfile); }
}
export class CrmPipelineService extends CrudService<CrmPipeline> {
  constructor() { super(CrmPipeline); }
}
export class CrmActivityService extends CreateReadService<CrmActivity> {
  constructor() { super(CrmActivity); }
}
export class RecruitmentVisitService extends CrudService<RecruitmentVisit> {
  constructor() { super(RecruitmentVisit); }
}
