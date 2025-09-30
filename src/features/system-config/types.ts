export type SystemConfig = {
  id: string;
  tenantId: string;
  tokoId: string | null;
  tokoNama: string | null;
  key: string;
  value: string | null;
  tipe: string | null;
  deskripsi: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type SystemConfigInput = {
  key: string;
  value: string | null;
  tipe: string | null;
  deskripsi: string | null;
  tokoId: string | null;
};
