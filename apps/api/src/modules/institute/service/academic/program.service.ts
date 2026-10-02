import { Program } from "../../model/academic/programs.model";
import { ProgramRepository } from "../../repository/academic/program.repository";
import { BaseService } from "../base.service";

export class ProgramService extends BaseService<Program> {
    constructor() {
        super(new ProgramRepository());
    }
}
