import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface User {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
  phone: string | null;
  roleName: string | null;
  roleLevel: number | null;
  tokoNama: string | null;
  tenantNama: string | null;
  status: string;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface UserDetailsProps {
  selectedUser: User | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "aktif":
      return "text-green-600 bg-green-50 border-green-200";
    case "nonaktif":
      return "text-slate-600 bg-slate-50 border-slate-200";
    case "suspended":
      return "text-red-600 bg-red-50 border-red-200";
    case "cuti":
      return "text-orange-600 bg-orange-50 border-orange-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
};

export function UserDetails({ selectedUser }: UserDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail User</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {selectedUser ? selectedUser.username : "Pilih user"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {selectedUser ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Username</dt>
                  <dd className="font-bold text-lg text-slate-900">{selectedUser.username}</dd>
                </div>
                {selectedUser.fullName && (
                  <div>
                    <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Lengkap</dt>
                    <dd className="font-medium text-slate-900">{selectedUser.fullName}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                  <dd>
                    <span className={cn(
                      "px-3 py-1 rounded text-sm font-semibold border capitalize",
                      getStatusColor(selectedUser.status)
                    )}>
                      {selectedUser.status}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Informasi User
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-4 text-sm">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Email</span>
                        <p className="text-slate-700">{selectedUser.email ?? "Tidak ada email"}</p>
                      </div>
                      <div>
                        <span className="text-xs uppercase tracking-wide text-slate-500">Telepon</span>
                        <p className="text-slate-700">{selectedUser.phone ?? "-"}</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Role</span>
                      <p className="text-slate-700 font-medium">
                        {selectedUser.roleName ?? "Tidak ada role"}
                        {selectedUser.roleLevel && (
                          <span className="text-slate-500 ml-2">
                            (Level {selectedUser.roleLevel})
                          </span>
                        )}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Toko</span>
                      <p className="text-slate-700">
                        {selectedUser.tokoNama ?? "Tidak terikat dengan toko"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Tenant</span>
                      <p className="text-slate-700">{selectedUser.tenantNama ?? "Unknown"}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Login</span>
                      <p className="text-slate-700">
                        {selectedUser.lastLogin ? formatDateTime(selectedUser.lastLogin) : "Belum pernah login"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                      <p className="text-slate-700">{formatDateTime(selectedUser.createdAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Diupdate</span>
                      <p className="text-slate-700">{formatDateTime(selectedUser.updatedAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">ID User</span>
                      <p className="font-mono text-slate-700">{selectedUser.id}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
            <Users className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih user untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris user untuk melihat informasi lengkap.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}