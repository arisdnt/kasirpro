export type InternalMessage = {
  id: string;
  judul: string;
  isi: string;
  createdAt: string;
  status: string | null;
  readAt?: string | null;
  type?: string | null;
  priority?: string | null;
  pengirimId?: string;
  penerimaId?: string | null;
  tokoTargetId?: string | null;
  pengirimNama?: string;
  penerimaNama?: string;
};

// Input payload for creating/updating internal messages
export type InternalMessageInput = {
  judul: string;
  isi: string;
  status?: string | null; // e.g., 'draft' | 'terkirim' | 'dibaca'
  type?: string | null; // e.g., 'pesan', 'informasi', etc.
  priority?: string | null; // e.g., 'normal', 'tinggi', 'urgent'
  // Targeting
  penerimaId?: string | null; // optional direct user target
  tokoTargetId?: string | null; // by default current store if applicable
};