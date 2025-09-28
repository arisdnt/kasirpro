import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ManagementRole } from "@/features/auth/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Crown, Shield, Users } from "lucide-react";
import { RolePermissionsList } from "./role-permissions-list";

interface RoleDetailsProps {
  role: ManagementRole | null;
}

function getLevelIcon(level: number) {
  if (level <= 1) return <Crown className="h-4 w-4 text-yellow-500" />;
  if (level <= 3) return <Shield className="h-4 w-4 text-blue-500" />;
  return <Users className="h-4 w-4 text-slate-500" />;
}

function getLevelLabel(level: number) {
  if (level <= 1) return "Super Admin";
  if (level <= 3) return "Admin";
  if (level <= 5) return "Manager";
  if (level <= 7) return "Staff";
  return "User";
}

function getStatusColor(isActive: boolean) {
  return isActive
    ? "text-green-600 bg-green-50 border-green-200"
    : "text-slate-600 bg-slate-50 border-slate-200";
}

export function RoleDetails({ role }: RoleDetailsProps) {
  return (
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 shadow-sm rounded-none" style={{ backgroundColor: 'transparent' }}>
      <CardContent className="flex flex-1 min-h-0 flex-col overflow-hidden p-0">
        {role ? (
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 font-mono text-sm">
                {/* Role Header */}
                <div className="text-center border-b-2 border-dashed border-gray-400 pb-4 mb-4">
                  <h1 className="text-xl font-bold mb-2">KASIR PRO</h1>
                  <p className="text-xs">Sistem Manajemen Role</p>
                  <div className="mt-3 pt-2 border-t border-gray-300">
                    <p className="font-bold">INFORMASI ROLE</p>
                  </div>
                </div>

                {/* Role Info */}
                <div className="mb-4 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>ID Role</span>
                    <span className="font-bold">{role.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nama Role</span>
                    <span className="font-bold flex items-center gap-1">
                      {getLevelIcon(role.level)}
                      {role.nama}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Level</span>
                    <span className="font-bold">{role.level} ({getLevelLabel(role.level)})</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status</span>
                    <span>
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border",
                        getStatusColor(role.isActive)
                      )}>
                        {role.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dibuat</span>
                    <span>{formatDateTime(role.createdAt)}</span>
                  </div>
                </div>

                {/* Description & Users */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Deskripsi & Statistik:</h4>
                  <div className="bg-gray-50 p-3 rounded border space-y-2">
                    <div>
                      <span className="text-xs font-semibold">Deskripsi:</span>
                      <p className="text-sm text-slate-700">{role.deskripsi ?? "Tidak ada deskripsi"}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold">Jumlah User:</span>
                      <p className="text-sm text-slate-700 font-bold">{role.userCount} user</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Permissions:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Total Permissions</span>
                      <span className="font-bold">{Object.keys(role.permissions).length}</span>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-50 p-3 rounded border">
                    <RolePermissionsList permissions={role.permissions} />
                  </div>
                </div>

                {/* System Info */}
                <div className="mt-4 border-t border-gray-300 pt-4">
                  <h4 className="text-xs uppercase tracking-wide text-slate-500 mb-2">Informasi Sistem:</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span>Update Terakhir</span>
                      <span>{formatDateTime(role.updatedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-400 text-center">
                  <p className="text-xs text-gray-500">Sistem Manajemen Role KasirPro</p>
                  <p className="text-xs text-gray-500">Role terverifikasi</p>
                </div>
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500 p-6">
            <Shield className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Pilih role untuk melihat detail</p>
            <p className="text-xs text-slate-500">
              Klik salah satu baris role untuk melihat informasi lengkap dan permissions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}