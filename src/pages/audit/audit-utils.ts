export function getActionColor(action: string) {
  switch (action) {
    case "INSERT":
      return "text-green-600 bg-green-50 border-green-200";
    case "UPDATE":
      return "text-blue-600 bg-blue-50 border-blue-200";
    case "DELETE":
      return "text-red-600 bg-red-50 border-red-200";
    default:
      return "text-slate-600 bg-slate-50 border-slate-200";
  }
}