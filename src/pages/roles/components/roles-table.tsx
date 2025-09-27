import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ManagementRole } from "@/features/auth/types";
import { Shield } from "lucide-react";
import { RoleTableRow } from "./role-table-row";

interface RolesTableProps {
  roles: ManagementRole[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectRole: (id: string) => void;
}

export function RolesTable({ roles, isLoading, selectedId, onSelectRole }: RolesTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Role</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar Role</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {roles.length} role
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : roles.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Shield className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada role yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan role baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[25%] text-slate-500">Nama Role</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Level</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Deskripsi</TableHead>
                  <TableHead className="w-[10%] text-slate-500">User</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Permissions</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles.map((role) => (
                  <RoleTableRow
                    key={role.id}
                    role={role}
                    isSelected={role.id === selectedId}
                    onSelect={onSelectRole}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}