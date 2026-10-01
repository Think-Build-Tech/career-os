export type IdAccountCreatePayload = {
  primary_email: string;
  first_name: string;
  last_name: string;
  display_name: string;
  status?: string;
};
export type IdAccountUpdatePayload = Partial<IdAccountCreatePayload>;

export type ExternalIdentityCreatePayload = {
  provider: string;
  provider_subject: string;
  email: string;
  account_id: string;
};
export type ExternalIdentityUpdatePayload = Partial<ExternalIdentityCreatePayload>;

export type IdSessionCreatePayload = {
  current_tenant_id: string;
  expires_at: string;
  account_id: string;
  revoked_at?: string | null;
};
export type IdSessionUpdatePayload = Partial<IdSessionCreatePayload>;

export type TenantAuthProviderCreatePayload = {
  provider_type: string;
  display_name: string;
  issuer_url: string;
  client_id: string;
  tenant_id: string;
  enabled?: boolean;
};
export type TenantAuthProviderUpdatePayload = Partial<TenantAuthProviderCreatePayload>;

export type TenantBrandingCreatePayload = {
  portal_name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  favicon_url: string;
  tenant_id: string;
};
export type TenantBrandingUpdatePayload = Partial<TenantBrandingCreatePayload>;

export type TenantDatabaseRegistryCreatePayload = {
  database_key: string;
  database_name: string;
  provider: string;
  region: string;
  secret_reference: string;
  tenant_id: string;
  schema_version?: number;
  status?: string;
};
export type TenantDatabaseRegistryUpdatePayload = Partial<TenantDatabaseRegistryCreatePayload>;

export type TenantDeploymentsCreatePayload = {
  deployment_mode: string;
  environment: string;
  region: string;
  routing_target: string;
  tenant_id: string;
  status?: string;
};
export type TenantDeploymentsUpdatePayload = Partial<TenantDeploymentsCreatePayload>;

export type TenantDomainsCreatePayload = {
  hostname: string;
  domain_type: string;
  tenant_id: string;
  is_primary?: boolean;
  verification_status?: string;
  tls_status?: string;
  verified_at?: string | null;
};
export type TenantDomainsUpdatePayload = Partial<TenantDomainsCreatePayload>;

export type TenantFeaturesCreatePayload = {
  tenant_id: string;
  feature_id: string;
  enabled?: boolean;
  configuration?: Record<string, unknown>;
};
export type TenantFeaturesUpdatePayload = Partial<TenantFeaturesCreatePayload>;

export type TenantInvitationCreatePayload = {
  invited_email: string;
  membership_type: string;
  expires_at: string;
  tenant_id: string;
  status?: string;
};
export type TenantInvitationUpdatePayload = Partial<TenantInvitationCreatePayload>;

export type FeaturesCreatePayload = {
  code: string;
  name: string;
  default_enabled?: boolean;
};
export type FeaturesUpdatePayload = Partial<FeaturesCreatePayload>;

export type SubscriptionPlansCreatePayload = {
  code: string;
  name: string;
  billing_period: string;
  base_price: number;
  max_users: number;
  monthly_ai_credits: number;
};
export type SubscriptionPlansUpdatePayload = Partial<SubscriptionPlansCreatePayload>;

export type AccountTenantMembershipCreatePayload = {
  account_id: string;
  tenant_id: string;
  membership_type: string;
  status?: string;
  joined_at?: string;
};
export type AccountTenantMembershipUpdatePayload = Partial<AccountTenantMembershipCreatePayload>;

export type TenantSubscriptionCreatePayload = {
  tenant_id: string;
  plan_id: string;
  renews_at: string;
  status?: string;
  started_at?: string;
};
export type TenantSubscriptionUpdatePayload = Partial<TenantSubscriptionCreatePayload>;
