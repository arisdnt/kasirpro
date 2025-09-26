import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Factory } from "lucide-react";
import { Link } from "react-router-dom";

export function PartnersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Relasi Bisnis"
        description="Kelola pelanggan dan supplier dalam satu dashboard terpusat."
        actions={<Button>Tambah Kontak</Button>}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-primary/10 bg-white/90 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Pelanggan</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola data pelanggan dan loyalti
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Akses database pelanggan lengkap dengan riwayat transaksi, poin rewards, dan informasi kontak.
            </p>
            <Link to="/customers">
              <Button variant="outline" className="w-full">
                Kelola Pelanggan
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border border-primary/10 bg-white/90 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Factory className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">Supplier</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Daftar supplier dan limit kredit
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Kelola daftar supplier aktif dengan informasi kontak, lokasi, dan status kerjasama.
            </p>
            <Link to="/suppliers">
              <Button variant="outline" className="w-full">
                Kelola Supplier
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
