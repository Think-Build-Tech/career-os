import { Role } from "../../model/access/roles.model";
import { BaseRepository } from "../base.repository";

export class RoleRepository extends BaseRepository<Role> {
    constructor() {
        super(Role);
    }
}
