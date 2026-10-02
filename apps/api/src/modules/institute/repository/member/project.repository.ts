import { Project } from "../../model/member/projects.model";
import { BaseRepository } from "../base.repository";

export class ProjectRepository extends BaseRepository<Project> {
    constructor() {
        super(Project);
    }
}
