import { cn } from "@/lib/utils";
import type { RolePermission } from "@/features/auth/types";

interface RolePermissionsListProps {
  permissions: RolePermission;
}

export function RolePermissionsList({ permissions }: RolePermissionsListProps) {
  const permissionEntries = Object.entries(permissions);

  if (permissionEntries.length === 0) {
    return (
      <p className="text-slate-500 text-xs italic">
        Tidak ada permission yang diatur
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-1">
      {permissionEntries.map(([key, value]) => (
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
  );
}