import { CrudService } from "../../services";
import Program from "../program.model";

export class ProgramService extends CrudService<Program> {
  constructor() {
    super(Program);
  }
}

export default ProgramService;
