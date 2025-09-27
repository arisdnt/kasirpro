import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Code, Cpu, HardDrive, Info, Laptop, Network, Monitor, MemoryStick, Disc, RefreshCw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-blue-600" />
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {children}
      </div>
      <Separator className="my-2" />
    </div>
  );
}

function Item({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white p-3 text-sm">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="font-medium text-gray-900 break-all">{String(value ?? '-')}
      </span>
    </div>
  );
}

export function DeviceInfoPage() {
  const [info, setInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [fetchedAt, setFetchedAt] = useState<number | null>(null);
  const [fromCache, setFromCache] = useState(false);

  const CACHE_KEY = 'deviceInfoCacheV1';

  const loadFromCache = () => {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (parsed && parsed.data) {
        setInfo(parsed.data);
        setFetchedAt(parsed.fetchedAt ?? null);
        setFromCache(true);
        return true;
      }
    } catch {}
    return false;
  };

  const saveToCache = (data: any) => {
    const now = Date.now();
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data, fetchedAt: now }));
    } catch {}
    setFetchedAt(now);
    setFromCache(false);
  };

  const fetchLive = async () => {
    if (!window.electronAPI?.getDeviceInfo) return;
    setLoading(true);
    try {
      const data = await window.electronAPI.getDeviceInfo();
      setInfo(data);
      saveToCache(data);
    } finally {
      setLoading(false);
    }
  };

  const loadDiskCache = async () => {
    try {
      if (!window.electronAPI?.getDeviceInfoCached) return false;
      const cached = await window.electronAPI.getDeviceInfoCached();
      if (cached && cached.data) {
        setInfo(cached.data);
        setFetchedAt(cached.fetchedAt ?? null);
        setFromCache(true);
        // sync to localStorage secondary cache
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(cached)); } catch {}
        return true;
      }
    } catch {}
    return false;
  };

  useEffect(() => {
    let unsub: (() => void) | undefined;
    // Prefer disk cache from main process
    (async () => {
      const hadDisk = await loadDiskCache();
      if (!hadDisk) {
        // fallback to localStorage cache
        const hadLocal = loadFromCache();
        if (!hadLocal) {
          // As a last resort, do live fetch
          void fetchLive();
        }
      }
    })();

    // subscribe to ready event to update when background collection finishes
    if (window.electronAPI?.onDeviceInfoReady) {
      unsub = window.electronAPI.onDeviceInfoReady(async () => {
        await loadDiskCache();
        setFromCache(true);
      });
    }
    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (!info) {
    return (
      <div className="p-4">
        <Card className="border-gray-200 bg-white p-4">Mengambil informasi perangkat...</Card>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Laptop className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Informasi Perangkat</h2>
          <Badge variant="outline" className="border-blue-200 text-blue-700">{info.platform} {info.release} ({info.arch})</Badge>
          {fromCache && (
            <Badge variant="outline" className="border-amber-300 text-amber-700">Cached</Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          {fetchedAt && (
            <div className="text-xs text-gray-600">
              Terakhir diperbarui: {new Date(fetchedAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              if (window.electronAPI?.refreshDeviceInfo) {
                setLoading(true);
                try {
                  await window.electronAPI.refreshDeviceInfo();
                  // The ready event will update the UI when finished
                } finally {
                  setLoading(false);
                }
              } else {
                // fallback to live fetch if API not available
                void fetchLive();
              }
            }}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Menyegarkan...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Card className="border-gray-200 bg-white p-4">
        <ScrollArea className="h-[70vh] pr-2">
          <div className="space-y-6">
            <Section title="Dasar" icon={Info}>
              <Item label="Nama Komputer" value={info.hostname} />
              <Item label="User" value={info.user?.username} />
              <Item label="Home Dir" value={info.user?.homedir} />
              <Item label="Shell" value={info.user?.shell} />
              <Item label="Versi Electron" value={info.electron} />
              <Item label="Versi Node" value={info.node} />
              <Item label="Versi Chrome" value={info.chrome} />
            </Section>

            <Section title="CPU" icon={Cpu}>
              <Item label="Pabrikan" value={info.cpu?.manufacturer} />
              <Item label="Model" value={info.cpu?.brand} />
              <Item label="Kecepatan (GHz)" value={info.cpu?.speed} />
              <Item label="Core Fisik" value={info.cpu?.physicalCores} />
              <Item label="Total Core" value={info.cpu?.cores} />
              <Item label="Processors" value={info.cpu?.processors} />
              <Item label="Cache L1d" value={info.cpu?.cache?.l1d} />
              <Item label="Cache L1i" value={info.cpu?.cache?.l1i} />
              <Item label="Cache L2" value={info.cpu?.cache?.l2} />
              <Item label="Cache L3" value={info.cpu?.cache?.l3} />
            </Section>

            <Section title="Memori" icon={MemoryStick}>
              <Item label="Total" value={formatBytes(info.memory?.totalBytes)} />
              <Item label="Terpakai" value={formatBytes(info.memory?.usedBytes)} />
              <Item label="Tersedia" value={formatBytes(info.memory?.freeBytes)} />
            </Section>

            <Section title="Penyimpanan (Mount)" icon={HardDrive}>
              {(info.disks || []).map((d: any, i: number) => (
                <div key={i} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Item label="Mount" value={d.mount} />
                  <Item label="FS" value={d.fs} />
                  <Item label="Label" value={d.label} />
                  <Item label="Ukuran" value={formatBytes(d.size)} />
                  <Item label="Terpakai" value={formatBytes(d.used)} />
                  <Item label="Tersedia" value={formatBytes(d.available)} />
                </div>
              ))}
            </Section>

            <Section title="Disk Layout (Fisikal)" icon={Disc}>
              {(info.diskLayout || []).map((d: any, i: number) => (
                <div key={i} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Item label="Nama" value={d.name} />
                  <Item label="Model" value={d.model} />
                  <Item label="Vendor" value={d.vendor} />
                  <Item label="Tipe" value={d.type} />
                  <Item label="Ukuran" value={formatBytes(d.size)} />
                  <Item label="Serial" value={d.serialNum || d.serial} />
                </div>
              ))}
            </Section>

            <Section title="BIOS" icon={Monitor}>
              <Item label="Serial Number" value={info.bios?.serialNumber} />
              <Item label="Versi" value={info.bios?.version} />
              <Item label="Rilis" value={info.bios?.releaseDate} />
            </Section>

            <Section title="Motherboard" icon={Monitor}>
              <Item label="Pabrikan" value={info.baseboard?.manufacturer} />
              <Item label="Produk" value={info.baseboard?.product} />
              <Item label="Serial Number" value={info.baseboard?.serialNumber} />
              <Item label="Versi" value={info.baseboard?.version} />
            </Section>

            <Section title="GPU" icon={Monitor}>
              {(info.graphics?.controllers || []).map((g: any, i: number) => (
                <div key={i} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Item label={`GPU ${i+1}`} value={g.model} />
                  <Item label="Vendor" value={g.vendor} />
                  <Item label="VRAM (MB)" value={g.vram} />
                </div>
              ))}
            </Section>

            <Section title="Jaringan" icon={Network}>
              {(info.networkInterfaces || []).map((ni: any, i: number) => (
                <div key={i} className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <Item label="Nama" value={ni.ifaceName || ni.iface} />
                  <Item label="MAC" value={ni.mac} />
                  <Item label="IPv4" value={ni.ip4} />
                  <Item label="IPv6" value={ni.ip6} />
                  <Item label="Gateway" value={ni.gateway} />
                  <Item label="Speed (Mbps)" value={ni.speed} />
                </div>
              ))}
            </Section>

            <Section title="Versi Runtime" icon={Code}>
              {Object.entries(info.versions || {}).map(([k, v]: any) => (
                <Item key={k} label={k} value={v} />
              ))}
            </Section>
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}

export default DeviceInfoPage;
