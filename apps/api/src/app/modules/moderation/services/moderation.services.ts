import { CreateReadService, MutableService } from "../../services";
import {
  MessageModeration,
  MessageReport,
  ModerationAction,
  ModerationCase,
} from "../models";

export class MessageModerationService extends CreateReadService<MessageModeration> {
  constructor() { super(MessageModeration); }
}
export class MessageReportService extends MutableService<MessageReport> {
  constructor() { super(MessageReport); }
}
export class ModerationCaseService extends MutableService<ModerationCase> {
  constructor() { super(ModerationCase); }
}
export class ModerationActionService extends CreateReadService<ModerationAction> {
  constructor() { super(ModerationAction); }
}
