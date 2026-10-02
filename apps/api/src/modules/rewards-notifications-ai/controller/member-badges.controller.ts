import { createResourceHandlers } from "../../../core/controller.utils";
import { MemberBadges } from "../model/member_badges.model";
import { MemberBadgesService } from "../service/member-badges.service";

const service = new MemberBadgesService();
const handlers = createResourceHandlers<MemberBadges>(service);

export const createMemberBadges = handlers.create;
export const getMemberBadgess = handlers.getAll;
export const getMemberBadgesById = handlers.getById;
export const updateMemberBadges = handlers.update;
export const deleteMemberBadges = handlers.delete;
