import { BaseService } from "../../../core/base.service";
import { CodingTestCases } from "../model/coding_test_cases.model";
import { CodingTestCasesRepository } from "../repository/coding-test-cases.repository";

export class CodingTestCasesService extends BaseService<CodingTestCases> {
    constructor() {
        super(new CodingTestCasesRepository());
    }
}
