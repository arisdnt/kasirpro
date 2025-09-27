import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import type { UseQueryResult } from "@tanstack/react-query";

interface User {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
  roleName: string | null;
  tokoNama: string | null;
  status: string;
  lastLogin: string | null;
}

interface UsersTableProps {
  filteredUsers: User[];
  selectedId: string | null;
  onSelectUser: (id: string) => void;
  users: UseQueryResult<User[]>;
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

export function UsersTable({
  filteredUsers,
  selectedId,
  onSelectUser,
  users,
}: UsersTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen User</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar User</CardTitle>
        </div>
        <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
          {filteredUsers.length} user
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
        <ScrollArea className="h-full">
          {users.isLoading ? (
            <div className="flex flex-col gap-2 p-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
              <Users className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-medium text-slate-700">Belum ada user yang cocok</p>
              <p className="text-xs text-slate-500">
                Sesuaikan pencarian atau tambahkan user baru untuk memulai.
              </p>
            </div>
          ) : (
            <Table className="min-w-full text-sm">
              <TableHeader className="sticky top-0 z-10 bg-white/95">
                <TableRow className="border-b border-slate-200">
                  <TableHead className="w-[20%] text-slate-500">Username</TableHead>
                  <TableHead className="w-[20%] text-slate-500">Nama Lengkap</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Email</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Role</TableHead>
                  <TableHead className="w-[15%] text-slate-500">Toko</TableHead>
                  <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                  <TableHead className="w-[5%] text-slate-500">Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((item) => (
                  <TableRow
                    key={item.id}
                    onClick={() => onSelectUser(item.id)}
                    data-state={item.id === selectedId ? "selected" : undefined}
                    className={cn(
                      "cursor-pointer border-b border-slate-100 transition",
                      item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                    )}
                  >
                    <TableCell className="align-top">
                      <span className={cn(
                        "font-medium",
                        item.id === selectedId ? "text-black" : "text-slate-900"
                      )}>
                        {item.username}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.fullName ?? "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.email ?? "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.roleName ?? "-"}
                    </TableCell>
                    <TableCell className={cn(
                      "align-top",
                      item.id === selectedId ? "text-black" : "text-slate-700"
                    )}>
                      {item.tokoNama ?? "-"}
                    </TableCell>
                    <TableCell className="align-top">
                      <span className={cn(
                        "px-2 py-1 rounded text-xs font-semibold border capitalize",
                        getStatusColor(item.status)
                      )}>
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell className={cn(
                      "align-top text-xs",
                      item.id === selectedId ? "text-black" : "text-slate-600"
                    )}>
                      {item.lastLogin ? formatDateTime(item.lastLogin) : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}