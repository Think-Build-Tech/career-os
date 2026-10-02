import { BaseRepository } from "../../../core/base.repository";
import { InstituteCompanies } from "../model/institute_companies.model";

export class InstituteCompaniesRepository extends BaseRepository<InstituteCompanies> {
    constructor() {
        super(InstituteCompanies);
    }
}
