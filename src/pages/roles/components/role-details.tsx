import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Role</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">
            {role ? role.nama : "Pilih role"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
        {role ? (
          <>
            <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
              <dl className="space-y-3 text-sm text-slate-600">
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Role</dt>
                  <dd className="flex items-center gap-2">
                    {getLevelIcon(role.level)}
                    <span className="font-bold text-lg text-slate-900">{role.nama}</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Level & Hierarki</dt>
                  <dd className="flex items-center gap-2">
                    <span className="font-mono text-slate-900">{role.level}</span>
                    <span className="text-slate-600">({getLevelLabel(role.level)})</span>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                  <dd>
                    <span className={cn(
                      "px-3 py-1 rounded text-sm font-semibold border",
                      getStatusColor(role.isActive)
                    )}>
                      {role.isActive ? "Aktif" : "Nonaktif"}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-none border border-slate-200 bg-white">
              <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3">
                <span className="text-sm font-semibold text-slate-800">
                  Informasi Role
                </span>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4">
                  <div className="space-y-4 text-sm">
                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Deskripsi</span>
                      <p className="text-slate-700">
                        {role.deskripsi ?? "Tidak ada deskripsi"}
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Jumlah User</span>
                      <p className="text-slate-700 font-semibold text-lg">
                        {role.userCount} user
                      </p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Permissions</span>
                      <div className="mt-2 space-y-2">
                        <RolePermissionsList permissions={role.permissions} />
                      </div>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                      <p className="text-slate-700">{formatDateTime(role.createdAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Diupdate</span>
                      <p className="text-slate-700">{formatDateTime(role.updatedAt)}</p>
                    </div>

                    <div>
                      <span className="text-xs uppercase tracking-wide text-slate-500">ID Role</span>
                      <p className="font-mono text-slate-700">{role.id}</p>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-slate-500">
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