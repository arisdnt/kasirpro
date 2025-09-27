export type AuditEntry = {
  id: string;
  tabel: string;
  aksi: string;
  userId: string | null;
  createdAt: string;
};