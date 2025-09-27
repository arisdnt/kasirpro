import { Separator } from "@/components/ui/separator";
import { useSupabaseAuth } from "@/features/auth/supabase-auth-provider";
import { useLocation } from "react-router-dom";
import { Copy, Database, Cpu, MemoryStick, Wifi, WifiOff, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabase-client";

export function StatusBar() {
  const {
    state: { user },
  } = useSupabaseAuth();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  // Time and date state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Connection status states
  const [realtimeStatus, setRealtimeStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connecting');
  const [dbPing, setDbPing] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  // System performance states
  const [systemInfo, setSystemInfo] = useState<{
    ram: { used: number; total: number } | null;
    cpu: number | null;
  }>({
    ram: null,
    cpu: null,
  });

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(location.pathname);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy path:', error);
    }
  };

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Monitor realtime connection status
  useEffect(() => {
    const client = getSupabaseClient();
    let statusCheckInterval: NodeJS.Timeout;

    const checkRealtimeStatus = () => {
      try {
        const rtClient = client.realtime as any;
        if (rtClient?.connection?.readyState === 1) {
          setRealtimeStatus('connected');
        } else if (rtClient?.connection?.readyState === 0) {
          setRealtimeStatus('connecting');
        } else {
          setRealtimeStatus('disconnected');
        }
      } catch {
        // Fallback: assume connected if no errors in basic operations
        setRealtimeStatus('connected');
      }
    };

    checkRealtimeStatus();
    statusCheckInterval = setInterval(checkRealtimeStatus, 5000);

    return () => {
      if (statusCheckInterval) clearInterval(statusCheckInterval);
    };
  }, []);

  // Monitor database ping and connection
  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const client = getSupabaseClient();
        const startTime = Date.now();

        // Simple ping test with a lightweight query
        const { error } = await client.from('tenants').select('id').limit(1);

        if (!error) {
          const ping = Date.now() - startTime;
          setDbPing(ping);
          setDbStatus('online');
        } else {
          setDbStatus('offline');
          setDbPing(null);
        }
      } catch {
        setDbStatus('offline');
        setDbPing(null);
      }
    };

    checkDatabaseStatus();
    const dbCheckInterval = setInterval(checkDatabaseStatus, 10000);

    return () => clearInterval(dbCheckInterval);
  }, []);

  // Monitor system performance
  useEffect(() => {
    const updateSystemInfo = () => {
      try {
        // Get memory info if available (Chrome/Edge)
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          if (memory) {
            setSystemInfo(prev => ({
              ...prev,
              ram: {
                used: Math.round(memory.usedJSHeapSize / 1024 / 1024), // MB
                total: Math.round(memory.totalJSHeapSize / 1024 / 1024), // MB
              }
            }));
          }
        }

        // CPU usage estimation based on timing
        const startTime = performance.now();
        setTimeout(() => {
          const endTime = performance.now();
          const delay = endTime - startTime;
          // Rough CPU load estimation (not accurate but gives an idea)
          const cpuLoad = Math.min(Math.max((delay - 16) / 16 * 100, 0), 100);
          setSystemInfo(prev => ({
            ...prev,
            cpu: Math.round(cpuLoad)
          }));
        }, 16);
      } catch {
        // System info not available
      }
    };

    updateSystemInfo();
    const systemInfoInterval = setInterval(updateSystemInfo, 3000);

    return () => clearInterval(systemInfoInterval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <footer className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-0.5 text-[10px] text-[#476EAE]">
      {/* Left side - User/System info */}
      <div className="flex flex-wrap items-center gap-2">
        <span>Tenant: {user?.tenantNama || user?.tenantId || "-"}</span>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />
        <span>Toko aktif: {user?.tokoNama || (user?.tokoId ? user.tokoId : "Semua")}</span>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />
        <span>Pengguna: {user?.fullName || user?.username || "-"}</span>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />
        <span>Peran: {user?.role?.nama || "-"}</span>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />
        <div className="flex items-center gap-1">
          <span>Path: <span className="text-red-500">{location.pathname}</span></span>
          <button
            onClick={handleCopyPath}
            className="inline-flex items-center justify-center rounded p-1 hover:bg-gray-100 transition-colors"
            title={copied ? "Copied!" : "Copy path"}
          >
            <Copy className="h-3 w-3" />
          </button>
          {copied && <span className="text-green-600 text-[9px]">Copied!</span>}
        </div>
      </div>

      {/* Right side - Time, Connection Status, System Performance */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Date and Time */}
        <div className="flex items-center gap-1">
          <Monitor className="h-3 w-3" />
          <span>{formatDate(currentTime)} {formatTime(currentTime)}</span>
        </div>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />

        {/* Realtime Status */}
        <div className="flex items-center gap-1" title={`Realtime: ${realtimeStatus}`}>
          {realtimeStatus === 'connected' ? (
            <Wifi className="h-3 w-3 text-green-500" />
          ) : realtimeStatus === 'connecting' ? (
            <Wifi className="h-3 w-3 text-yellow-500" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-500" />
          )}
          <span className={realtimeStatus === 'connected' ? 'text-green-600' : realtimeStatus === 'connecting' ? 'text-yellow-600' : 'text-red-600'}>
            RT
          </span>
        </div>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />

        {/* Database Status */}
        <div className="flex items-center gap-1" title={`Database: ${dbStatus}${dbPing ? ` (${dbPing}ms)` : ''}`}>
          <Database className={`h-3 w-3 ${dbStatus === 'online' ? 'text-green-500' : dbStatus === 'checking' ? 'text-yellow-500' : 'text-red-500'}`} />
          <span className={dbStatus === 'online' ? 'text-green-600' : dbStatus === 'checking' ? 'text-yellow-600' : 'text-red-600'}>
            {dbPing ? `${dbPing}ms` : dbStatus === 'checking' ? 'DB' : 'OFF'}
          </span>
        </div>
        <Separator orientation="vertical" className="hidden h-3 lg:block" />

        {/* System Performance */}
        {systemInfo.ram && (
          <>
            <div className="flex items-center gap-1" title={`RAM: ${systemInfo.ram.used}MB / ${systemInfo.ram.total}MB`}>
              <MemoryStick className="h-3 w-3" />
              <span>{systemInfo.ram.used}MB</span>
            </div>
            <Separator orientation="vertical" className="hidden h-3 lg:block" />
          </>
        )}

        {systemInfo.cpu !== null && (
          <>
            <div className="flex items-center gap-1" title={`CPU Load: ${systemInfo.cpu}%`}>
              <Cpu className="h-3 w-3" />
              <span>{systemInfo.cpu}%</span>
            </div>
            <Separator orientation="vertical" className="hidden h-3 lg:block" />
          </>
        )}

        <span>v1.0.0</span>
      </div>
    </footer>
  );
}
