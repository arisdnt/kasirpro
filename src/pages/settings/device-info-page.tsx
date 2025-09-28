import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Code, Cpu, HardDrive, Info, Laptop, Network, Monitor, MemoryStick, Disc, RefreshCw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

function TableSection({ title, icon: Icon, data }: { title: string; icon: any; data: Array<{ label: string; value: any }> }) {
  return (
    <Card className="border-gray-200 bg-white rounded-none">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-0">
        <Table>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <TableCell className="font-medium text-gray-700 w-1/3">
                  {item.label}
                </TableCell>
                <TableCell className="text-gray-900 break-all">
                  {String(item.value ?? '-')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

function MultiTableSection({ title, icon: Icon, sections }: { title: string; icon: any; sections: Array<{ subtitle: string; data: Array<{ label: string; value: any }> }> }) {
  return (
    <Card className="border-gray-200 bg-white rounded-none">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-0">
        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            {section.subtitle && (
              <div className="px-4 py-2 bg-gray-100 border-b border-gray-200">
                <h4 className="text-sm font-medium text-gray-700">{section.subtitle}</h4>
              </div>
            )}
            <Table>
              <TableBody>
                {section.data.map((item, index) => (
                  <TableRow key={index} className={`hover:bg-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <TableCell className="font-medium text-gray-700 w-1/3">
                      {item.label}
                    </TableCell>
                    <TableCell className="text-gray-900 break-all">
                      {String(item.value ?? '-')}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {sectionIndex < sections.length - 1 && <div className="border-b border-gray-200" />}
          </div>
        ))}
      </div>
    </Card>
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
      <div className="space-y-6 pb-10">
        <Card className="border-gray-200 bg-white rounded-none p-6">Mengambil informasi perangkat...</Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        title="Informasi Perangkat"
        description={`Detail lengkap spesifikasi perangkat ${info.hostname || 'sistem'}.`}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                {info.platform} {info.release} ({info.arch})
              </Badge>
              {fromCache && (
                <Badge variant="outline" className="border-amber-300 text-amber-700">Cached</Badge>
              )}
            </div>
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
        }
      />

      <div className="space-y-6">
        <TableSection
          title="Dasar"
          icon={Info}
          data={[
            { label: "Nama Komputer", value: info.hostname },
            { label: "User", value: info.user?.username },
            { label: "Home Dir", value: info.user?.homedir },
            { label: "Shell", value: info.user?.shell },
            { label: "Versi Electron", value: info.electron },
            { label: "Versi Node", value: info.node },
            { label: "Versi Chrome", value: info.chrome },
          ]}
        />

        <TableSection
          title="CPU"
          icon={Cpu}
          data={[
            { label: "Pabrikan", value: info.cpu?.manufacturer },
            { label: "Model", value: info.cpu?.brand },
            { label: "Kecepatan (GHz)", value: info.cpu?.speed },
            { label: "Core Fisik", value: info.cpu?.physicalCores },
            { label: "Total Core", value: info.cpu?.cores },
            { label: "Processors", value: info.cpu?.processors },
            { label: "Cache L1d", value: info.cpu?.cache?.l1d },
            { label: "Cache L1i", value: info.cpu?.cache?.l1i },
            { label: "Cache L2", value: info.cpu?.cache?.l2 },
            { label: "Cache L3", value: info.cpu?.cache?.l3 },
          ]}
        />

        <TableSection
          title="Memori"
          icon={MemoryStick}
          data={[
            { label: "Total", value: formatBytes(info.memory?.totalBytes) },
            { label: "Terpakai", value: formatBytes(info.memory?.usedBytes) },
            { label: "Tersedia", value: formatBytes(info.memory?.freeBytes) },
          ]}
        />

        <MultiTableSection
          title="Penyimpanan (Mount)"
          icon={HardDrive}
          sections={(info.disks || []).map((d: any, i: number) => ({
            subtitle: `Drive ${i + 1}: ${d.mount || `Disk ${i + 1}`}`,
            data: [
              { label: "Mount", value: d.mount },
              { label: "File System", value: d.fs },
              { label: "Label", value: d.label },
              { label: "Ukuran", value: formatBytes(d.size) },
              { label: "Terpakai", value: formatBytes(d.used) },
              { label: "Tersedia", value: formatBytes(d.available) },
            ]
          }))}
        />

        <MultiTableSection
          title="Disk Layout (Fisikal)"
          icon={Disc}
          sections={(info.diskLayout || []).map((d: any, i: number) => ({
            subtitle: `Disk ${i + 1}: ${d.name || d.model || `Disk ${i + 1}`}`,
            data: [
              { label: "Nama", value: d.name },
              { label: "Model", value: d.model },
              { label: "Vendor", value: d.vendor },
              { label: "Tipe", value: d.type },
              { label: "Ukuran", value: formatBytes(d.size) },
              { label: "Serial", value: d.serialNum || d.serial },
            ]
          }))}
        />

        <TableSection
          title="BIOS"
          icon={Monitor}
          data={[
            { label: "Serial Number", value: info.bios?.serialNumber },
            { label: "Versi", value: info.bios?.version },
            { label: "Tanggal Rilis", value: info.bios?.releaseDate },
          ]}
        />

        <TableSection
          title="Motherboard"
          icon={Monitor}
          data={[
            { label: "Pabrikan", value: info.baseboard?.manufacturer },
            { label: "Produk", value: info.baseboard?.product },
            { label: "Serial Number", value: info.baseboard?.serialNumber },
            { label: "Versi", value: info.baseboard?.version },
          ]}
        />

        <MultiTableSection
          title="GPU"
          icon={Monitor}
          sections={(info.graphics?.controllers || []).map((g: any, i: number) => ({
            subtitle: `GPU ${i + 1}: ${g.model || `GPU ${i + 1}`}`,
            data: [
              { label: "Model", value: g.model },
              { label: "Vendor", value: g.vendor },
              { label: "VRAM (MB)", value: g.vram },
            ]
          }))}
        />

        <MultiTableSection
          title="Jaringan"
          icon={Network}
          sections={(info.networkInterfaces || []).map((ni: any, i: number) => ({
            subtitle: `Interface ${i + 1}: ${ni.ifaceName || ni.iface || `Network ${i + 1}`}`,
            data: [
              { label: "Nama", value: ni.ifaceName || ni.iface },
              { label: "MAC Address", value: ni.mac },
              { label: "IPv4", value: ni.ip4 },
              { label: "IPv6", value: ni.ip6 },
              { label: "Gateway", value: ni.gateway },
              { label: "Kecepatan (Mbps)", value: ni.speed },
            ]
          }))}
        />

        <TableSection
          title="Versi Runtime"
          icon={Code}
          data={Object.entries(info.versions || {}).map(([k, v]: any) => ({
            label: k,
            value: v
          }))}
        />
      </div>
    </div>
  );
}

export default DeviceInfoPage;
