export type TenantCreatePayload = {
  name: string;
  slug: string;
  legal_name: string;
  tenant_type: string;
  status: string;
  country_code: string;
  timezone: string;
};

export type TenantUpdatePayload = Partial<TenantCreatePayload>;
