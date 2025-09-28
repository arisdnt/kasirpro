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
  users: User[];
  isLoading: boolean;
  selectedId: string | null;
  onSelectUser: (id: string) => void;
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
  users,
  isLoading,
  selectedId,
  onSelectUser,
}: UsersTableProps) {
  return (
    <Card className="flex h-full min-h-0 flex-col border border-primary/10 rounded-none" style={{
      backgroundColor: '#f6f9ff',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
    }}>
      <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2" style={{ backgroundColor: '#f6f9ff' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen User</span>
          <span className="text-black">•</span>
          <CardTitle className="text-sm text-black">Daftar User</CardTitle>
        </div>
        <Badge variant="secondary" className="text-white rounded-none" style={{ backgroundColor: '#3b91f9' }}>
          {users.length} user
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-hidden p-0 flex flex-col">
        {isLoading ? (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-12 w-full rounded-md" />
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center text-slate-500">
            <Users className="h-10 w-10 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada user yang cocok</p>
            <p className="text-xs text-slate-500">
              Sesuaikan pencarian atau tambahkan user baru untuk memulai.
            </p>
          </div>
        ) : (
          <>
            {/* Fixed Header */}
            <div className="shrink-0 border-b border-slate-200" style={{ backgroundColor: '#f6f9ff' }}>
              <Table className="min-w-full text-sm">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[20%] text-slate-500">Username</TableHead>
                    <TableHead className="w-[20%] text-slate-500">Nama Lengkap</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Email</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Role</TableHead>
                    <TableHead className="w-[15%] text-slate-500">Toko</TableHead>
                    <TableHead className="w-[10%] text-slate-500">Status</TableHead>
                    <TableHead className="w-[5%] text-slate-500">Login</TableHead>
                  </TableRow>
                </TableHeader>
              </Table>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
              <Table className="min-w-full text-sm">
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow
                      key={user.id}
                      onClick={() => onSelectUser(user.id)}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 transition h-14",
                        user.id === selectedId
                          ? "text-black"
                          : index % 2 === 0
                            ? "bg-white hover:bg-slate-50"
                            : "bg-gray-50/50 hover:bg-slate-100"
                      )}
                      style={user.id === selectedId ? { backgroundColor: '#e6f4f1' } : undefined}
                    >
                      <TableCell className="align-middle py-4">
                        <span className="font-medium text-slate-800">
                          {user.username}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {user.fullName ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {user.email ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {user.roleName ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4 text-slate-700">
                        {user.tokoNama ?? "-"}
                      </TableCell>
                      <TableCell className="align-middle py-4">
                        <span className={cn(
                          "px-2 py-1 rounded text-xs font-semibold border capitalize",
                          getStatusColor(user.status)
                        )}>
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="align-middle py-4 text-xs text-slate-600">
                        {user.lastLogin ? formatDateTime(user.lastLogin) : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
}