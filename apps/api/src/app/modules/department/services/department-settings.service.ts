import { CrudService } from "../../services";
import DepartmentSettings from "../department.settings.model";

export class DepartmentSettingsService extends CrudService<DepartmentSettings> {
  constructor() {
    super(DepartmentSettings);
  }
}

export default DepartmentSettingsService;
