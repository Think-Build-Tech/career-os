import { CrudService, MutableService } from "../../services";
import { ExternalIdMapping, IntegrationConnection, SyncJob } from "../models";

export class IntegrationConnectionService extends CrudService<IntegrationConnection> {
  constructor() { super(IntegrationConnection); }
}
export class SyncJobService extends MutableService<SyncJob> {
  constructor() { super(SyncJob); }
}
export class ExternalIdMappingService extends CrudService<ExternalIdMapping> {
  constructor() { super(ExternalIdMapping); }
}
