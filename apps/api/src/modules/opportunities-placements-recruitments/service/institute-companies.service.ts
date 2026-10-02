import { BaseService } from "../../../core/base.service";
import { InstituteCompanies } from "../model/institute_companies.model";
import { InstituteCompaniesRepository } from "../repository/institute-companies.repository";

export class InstituteCompaniesService extends BaseService<InstituteCompanies> {
    constructor() {
        super(new InstituteCompaniesRepository());
    }
}
