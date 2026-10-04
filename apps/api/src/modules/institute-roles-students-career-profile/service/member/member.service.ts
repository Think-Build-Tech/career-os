import { Member } from "../../model/member/members.model";
import { MemberRepository } from "../../repository/member/member.repository";
import { BaseService } from "../base.service";
import { CreationAttributes } from "sequelize";
import { AccountTenantMembership } from "../../../control-plane-identity/model/membership/account_tenant_membership.model";
import { TenantDomains } from "../../../control-plane-identity/model/tenant/tenant_domains.model";

export class MemberService extends BaseService<Member> {
    constructor() {
        super(new MemberRepository());
    }

    async create(data: CreationAttributes<Member>): Promise<Member> {
        // Find membership to get tenant_id
        const membership = await AccountTenantMembership.findOne({
            where: { account_id: data.account_id }
        });

        if (membership) {
            // Find all domains for this tenant
            const domains = await TenantDomains.findAll({
                where: { tenant_id: membership.tenant_id }
            });
            
            const emailDomain = data.institutional_email.split('@')[1];
            const isDomainMatch = domains.some(d => d.hostname.toLowerCase() === emailDomain?.toLowerCase());

            if (isDomainMatch) {
                data.status = 'active';
                
                // Ensure membership is also active
                if (membership.status !== 'active') {
                    membership.status = 'active';
                    await membership.save();
                }
            } else {
                data.status = 'pending_approval';
                
                // Update membership to pending
                if (membership.status !== 'pending_approval') {
                    membership.status = 'pending_approval';
                    await membership.save();
                }
            }
        } else {
            // Default to pending if we can't verify tenant
            data.status = 'pending_approval';
        }

        return super.create(data);
    }

    async approveMember(id: string, adminId?: string): Promise<Member | null> {
        const member = await this.repository.getById(id, {});
        if (!member) return null;

        member.status = 'active';
        await member.save();

        const membership = await AccountTenantMembership.findOne({
            where: { account_id: member.account_id }
        });
        if (membership) {
            membership.status = 'active';
            await membership.save();
        }

        return member;
    }

    async rejectMember(id: string, adminId?: string): Promise<Member | null> {
        const member = await this.repository.getById(id, {});
        if (!member) return null;

        member.status = 'rejected';
        await member.save();

        const membership = await AccountTenantMembership.findOne({
            where: { account_id: member.account_id }
        });
        if (membership) {
            membership.status = 'rejected';
            await membership.save();
        }

        return member;
    }
}
