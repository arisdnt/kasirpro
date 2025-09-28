import { Card, CardContent } from "@/components/ui/card";
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
  user: User | null;
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

export function UserDetails({ user }: UserDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {user ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* User Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Manajemen User</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">INFORMASI USER</p>
                  </div>
                </div>

                {/* User Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ID User</span>
                    <span className="font-bold">{user.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Username</span>
                    <span className="font-bold">{user.username}</span>
                  </div>
                  {user.fullName && (
                    <div className="flex justify-between">
                      <span>Nama Lengkap</span>
                      <span className="font-bold">{user.fullName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border capitalize",
                        getStatusColor(user.status)
                      )}>
                        {user.status}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span>{formatDateTime(user.createdAt)}</span>
                  </div>
                </div>

                {/* Contact & Personal */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Informasi Kontak:</h4>
                  <div className="bg-gray-50 p-3 rounded border space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-xs font-semibold">Email:</span>
                        <p className="text-sm text-slate-700">{user.email ?? "Tidak ada email"}</p>
                      </div>
                      <div>
                        <span className="text-xs font-semibold">Telepon:</span>
                        <p className="text-sm text-slate-700">{user.phone ?? "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role & Access */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Role & Akses:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Role</span>
                      <span className="font-bold">{user.roleName ?? "Tidak ada role"}</span>
                    </div>
                    {user.roleLevel && (
                      <div className="flex justify-between">
                        <span>Level Role</span>
                        <span className="font-bold">{user.roleLevel}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Toko</span>
                      <span className="font-bold">{user.tokoNama ?? "Tidak terikat"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenant</span>
                      <span className="font-bold">{user.tenantNama ?? "Unknown"}</span>
                    </div>
                  </div>
                </div>

                {/* Activity */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Aktivitas:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Terakhir Login</span>
                      <span className="font-bold">
                        {user.lastLogin ? formatDateTime(user.lastLogin) : "Belum pernah"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Update Terakhir</span>
                      <span>{formatDateTime(user.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Manajemen User KasirPro</p>
                  <p className="text-xs text-gray-500">User terverifikasi</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
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