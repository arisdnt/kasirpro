export type DetailedUser = {
  id: string;
  username: string;
  email: string | null;
  fullName: string | null;
  phone: string | null;
  status: string | null;
  tenantId: string;
  tenantNama: string | null;
  tokoId: string | null;
  tokoNama: string | null;
  role: { id: string; nama: string; level: number } | null;
  metadata: Record<string, unknown> | null;
  authUserId: string | null;
  lastLogin: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type UserMetrics = {
  auditLast7d: number;
  auditLast30d: number;
  promosCreated: number;
  newsCreated: number;
  lastActivityAt: string | null;
};
