import { BaseRepository } from "../../../core/base.repository";
import { CodingTestCases } from "../model/coding_test_cases.model";

export class CodingTestCasesRepository extends BaseRepository<CodingTestCases> {
    constructor() {
        super(CodingTestCases);
    }
}
