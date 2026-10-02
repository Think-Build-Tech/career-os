import { BaseService } from "../../../core/base.service";
import { CodingProblems } from "../model/coding_problems.model";
import { CodingProblemsRepository } from "../repository/coding-problems.repository";

export class CodingProblemsService extends BaseService<CodingProblems> {
    constructor() {
        super(new CodingProblemsRepository());
    }
}
