import { CrudService } from "../../services";
import User from "../user.model";

export class UserService extends CrudService<User> {
  constructor() {
    super(User);
  }
}

export default UserService;
