import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { useRolesQuery } from "@/features/roles/use-roles";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Shield, Filter, Plus, RefreshCw, Search, Users, Crown } from "lucide-react";

type StatusFilter = "all" | "active" | "inactive";

export function RolesPage() {
  const roles = useRolesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const data = roles.data ?? [];
    const total = data.length;
    const active = data.filter((item) => item.isActive).length;
    const inactive = data.filter((item) => !item.isActive).length;
    const totalUsers = data.reduce((sum, item) => sum + item.userCount, 0);
    return { total, active, inactive, totalUsers };
  }, [roles.data]);

  const filteredRoles = useMemo(() => {
    const data = roles.data ?? [];
    const query = searchTerm.trim().toLowerCase();
    return data
      .filter((item) => {
        const matchesSearch =
          query.length === 0 ||
          item.nama.toLowerCase().includes(query) ||
          (item.deskripsi ?? "").toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && item.isActive) ||
          (statusFilter === "inactive" && !item.isActive);
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => a.level - b.level);
  }, [roles.data, searchTerm, statusFilter]);

  const selectedRole = useMemo(() => {
    if (!selectedId) return null;
    return filteredRoles.find((item) => item.id === selectedId) ?? null;
  }, [filteredRoles, selectedId]);

  const handleRefresh = () => {
    roles.refetch();
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "text-green-600 bg-green-50 border-green-200"
      : "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getLevelIcon = (level: number) => {
    if (level <= 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (level <= 3) return <Shield className="h-4 w-4 text-blue-500" />;
    return <Users className="h-4 w-4 text-slate-500" />;
  };

  const getLevelLabel = (level: number) => {
    if (level <= 1) return "Super Admin";
    if (level <= 3) return "Admin";
    if (level <= 5) return "Manager";
    if (level <= 7) return "Staff";
    return "User";
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] flex-col gap-4 overflow-hidden -mx-4 -my-6 px-2 py-2">
      <Card className="shrink-0 border border-primary/10 bg-white/95 shadow-sm rounded-none">
        <CardContent className="flex flex-col gap-3 py-4 text-black">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="flex min-w-[260px] flex-1 items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Cari nama role atau deskripsi"
                  className="h-10 rounded-none border-slate-200 pl-9 text-sm text-black shadow-inner focus-visible:ring-2 focus-visible:ring-primary/40"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-slate-400" />
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                  className="h-10 rounded-none border border-slate-200 bg-white px-3 text-sm text-black shadow-inner focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <option value="all">Semua status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>
            <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
              <div className="flex gap-3 text-xs text-black">
                <span>Total Role: <strong>{stats.total}</strong></span>
                <span>Aktif: <strong>{stats.active}</strong></span>
                <span>User: <strong>{stats.totalUsers}</strong></span>
              </div>
              <Button variant="outline" onClick={handleRefresh} className="gap-2 text-white rounded-none">
                <RefreshCw className="h-4 w-4" />
                Refresh data
              </Button>
              <Button className="gap-2 text-white rounded-none">
                <Plus className="h-4 w-4" />
                Role baru
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-1 min-h-0 flex-col gap-4 lg:flex-row">
        <div className="w-full lg:w-3/4">
          <Card className="flex h-full min-h-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Manajemen Role</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">Daftar Role</CardTitle>
            </div>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700 rounded-none">
              {filteredRoles.length} role
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 overflow-hidden p-0">
            <ScrollArea className="h-full">
              {roles.isLoading ? (
                <div className="flex flex-col gap-2 p-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : filteredRoles.length === 0 ? (
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
                    {filteredRoles.map((item) => (
                      <TableRow
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        data-state={item.id === selectedId ? "selected" : undefined}
                        className={cn(
                          "cursor-pointer border-b border-slate-100 transition",
                          item.id === selectedId ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
                        )}
                      >
                        <TableCell className="align-top">
                          <div className="flex items-center gap-2">
                            {getLevelIcon(item.level)}
                            <span className={cn(
                              "font-medium",
                              item.id === selectedId ? "text-black" : "text-slate-900"
                            )}>
                              {item.nama}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{item.level}</span>
                            <span className="text-xs text-slate-500">({getLevelLabel(item.level)})</span>
                          </div>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top max-w-32 truncate",
                          item.id === selectedId ? "text-black" : "text-slate-700"
                        )}>
                          {item.deskripsi ?? "-"}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-center font-semibold",
                          item.id === selectedId ? "text-black" : "text-slate-900"
                        )}>
                          {item.userCount}
                        </TableCell>
                        <TableCell className="align-top">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-semibold border",
                            getStatusColor(item.isActive)
                          )}>
                            {item.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-center font-mono text-xs",
                          item.id === selectedId ? "text-black" : "text-slate-600"
                        )}>
                          {Object.keys(item.permissions).length}
                        </TableCell>
                        <TableCell className={cn(
                          "align-top text-xs",
                          item.id === selectedId ? "text-black" : "text-slate-600"
                        )}>
                          {formatDateTime(item.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        </div>

        <div className="w-full lg:w-1/4">
          <Card className="flex w-full h-full shrink-0 flex-col border border-primary/10 bg-white/95 shadow-sm rounded-none">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between gap-2 py-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-black">Detail Role</span>
              <span className="text-black">•</span>
              <CardTitle className="text-sm text-black">
                {selectedRole ? selectedRole.nama : "Pilih role"}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-1 min-h-0 flex-col gap-4 overflow-hidden">
            {selectedRole ? (
              <>
                <div className="shrink-0 rounded-none border border-slate-200 bg-white p-4 shadow-inner">
                  <dl className="space-y-3 text-sm text-slate-600">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Nama Role</dt>
                      <dd className="flex items-center gap-2">
                        {getLevelIcon(selectedRole.level)}
                        <span className="font-bold text-lg text-slate-900">{selectedRole.nama}</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Level & Hierarki</dt>
                      <dd className="flex items-center gap-2">
                        <span className="font-mono text-slate-900">{selectedRole.level}</span>
                        <span className="text-slate-600">({getLevelLabel(selectedRole.level)})</span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Status</dt>
                      <dd>
                        <span className={cn(
                          "px-3 py-1 rounded text-sm font-semibold border",
                          getStatusColor(selectedRole.isActive)
                        )}>
                          {selectedRole.isActive ? "Aktif" : "Nonaktif"}
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
                            {selectedRole.deskripsi ?? "Tidak ada deskripsi"}
                          </p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Jumlah User</span>
                          <p className="text-slate-700 font-semibold text-lg">
                            {selectedRole.userCount} user
                          </p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Permissions</span>
                          <div className="mt-2 space-y-2">
                            {Object.keys(selectedRole.permissions).length > 0 ? (
                              <div className="grid grid-cols-1 gap-1">
                                {Object.entries(selectedRole.permissions).map(([key, value]) => (
                                  <div key={key} className="flex justify-between items-center text-xs">
                                    <span className="text-slate-700 font-medium">{key}</span>
                                    <span className={cn(
                                      "px-2 py-0.5 rounded text-xs border",
                                      value ? "text-green-600 bg-green-50 border-green-200" : "text-red-600 bg-red-50 border-red-200"
                                    )}>
                                      {value ? "Allow" : "Deny"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-slate-500 text-xs italic">Tidak ada permission yang diatur</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Dibuat</span>
                          <p className="text-slate-700">{formatDateTime(selectedRole.createdAt)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">Terakhir Diupdate</span>
                          <p className="text-slate-700">{formatDateTime(selectedRole.updatedAt)}</p>
                        </div>

                        <div>
                          <span className="text-xs uppercase tracking-wide text-slate-500">ID Role</span>
                          <p className="font-mono text-slate-700">{selectedRole.id}</p>
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
        </div>
      </div>
    </div>
  );
}