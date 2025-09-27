import { TableCell, TableRow } from "@/components/ui/table";
import type { ManagementRole } from "@/features/auth/types";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Crown, Shield, Users } from "lucide-react";

interface RoleTableRowProps {
  role: ManagementRole;
  isSelected: boolean;
  onSelect: (id: string) => void;
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

export function RoleTableRow({ role, isSelected, onSelect }: RoleTableRowProps) {
  return (
    <TableRow
      onClick={() => onSelect(role.id)}
      data-state={isSelected ? "selected" : undefined}
      className={cn(
        "cursor-pointer border-b border-slate-100 transition",
        isSelected ? "!bg-gray-100 text-black" : "hover:bg-slate-50"
      )}
    >
      <TableCell className="align-top">
        <div className="flex items-center gap-2">
          {getLevelIcon(role.level)}
          <span className={cn(
            "font-medium",
            isSelected ? "text-black" : "text-slate-900"
          )}>
            {role.nama}
          </span>
        </div>
      </TableCell>
      <TableCell className={cn(
        "align-top",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        <div className="flex items-center gap-1">
          <span className="font-mono text-xs">{role.level}</span>
          <span className="text-xs text-slate-500">({getLevelLabel(role.level)})</span>
        </div>
      </TableCell>
      <TableCell className={cn(
        "align-top max-w-32 truncate",
        isSelected ? "text-black" : "text-slate-700"
      )}>
        {role.deskripsi ?? "-"}
      </TableCell>
      <TableCell className={cn(
        "align-top text-center font-semibold",
        isSelected ? "text-black" : "text-slate-900"
      )}>
        {role.userCount}
      </TableCell>
      <TableCell className="align-top">
        <span className={cn(
          "px-2 py-1 rounded text-xs font-semibold border",
          getStatusColor(role.isActive)
        )}>
          {role.isActive ? "Aktif" : "Nonaktif"}
        </span>
      </TableCell>
      <TableCell className={cn(
        "align-top text-center font-mono text-xs",
        isSelected ? "text-black" : "text-slate-600"
      )}>
        {Object.keys(role.permissions).length}
      </TableCell>
      <TableCell className={cn(
        "align-top text-xs",
        isSelected ? "text-black" : "text-slate-600"
      )}>
        {formatDateTime(role.createdAt)}
      </TableCell>
    </TableRow>
  );
}