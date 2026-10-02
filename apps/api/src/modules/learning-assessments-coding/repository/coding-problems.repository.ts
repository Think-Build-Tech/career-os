import { BaseRepository } from "../../../core/base.repository";
import { CodingProblems } from "../model/coding_problems.model";

export class CodingProblemsRepository extends BaseRepository<CodingProblems> {
    constructor() {
        super(CodingProblems);
    }
}
