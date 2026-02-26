import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Car, Search, Plus, Pencil, Trash2, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, CheckCircle, AlertTriangle, Wrench,
  Minus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Addon {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  isActive: boolean;
  total: number;
  available: number;
  reserved: number;
  damaged: number;
}

const mockAddons: Addon[] = [
  { id: "SEAT-001", name: "เบาะนั่งเด็ก ตัวที่ 1", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, total: 3, available: 2, reserved: 1, damaged: 0 },
  { id: "SEAT-002", name: "เบาะนั่งเด็ก ตัวที่ 2", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, total: 3, available: 1, reserved: 1, damaged: 1 },
  { id: "SEAT-003", name: "เบาะนั่งเด็ก ตัวที่ 3", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, total: 3, available: 2, reserved: 1, damaged: 0 },
  { id: "CAMP-001", name: "ชุดแคมปิ้ง A", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, total: 5, available: 3, reserved: 2, damaged: 0 },
  { id: "CAMP-002", name: "ชุดแคมปิ้ง B", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, total: 5, available: 4, reserved: 1, damaged: 0 },
  { id: "BBQ-001", name: "ชุดปิ้งย่างใหญ่", category: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true, total: 4, available: 4, reserved: 0, damaged: 0 },
  { id: "BBQ-002", name: "ชุดปิ้งย่างเล็ก", category: "ชุดปิ้งย่าง", defaultPrice: 100, isActive: true, total: 4, available: 3, reserved: 1, damaged: 0 },
  { id: "GEN-001", name: "เครื่องปั่นไฟ Honda 3kW", category: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true, total: 1, available: 0, reserved: 1, damaged: 0 },
  { id: "GEN-002", name: "เครื่องปั่นไฟ Yamaha 2kW", category: "เครื่องปั่นไฟ", defaultPrice: 25000, isActive: true, total: 1, available: 1, reserved: 0, damaged: 0 },
  { id: "GEN-003", name: "เครื่องปั่นไฟ Honda 5kW", category: "เครื่องปั่นไฟ", defaultPrice: 45000, isActive: false, total: 1, available: 0, reserved: 0, damaged: 1 },
  { id: "TBL-001", name: "โต๊ะกลางแจ้ง 6 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true, total: 3, available: 3, reserved: 0, damaged: 0 },
  { id: "TBL-002", name: "โต๊ะกลางแจ้ง 4 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 400, isActive: true, total: 3, available: 2, reserved: 1, damaged: 0 },
  { id: "CHR-001", name: "เก้าอี้พับ ชุด A (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, total: 4, available: 2, reserved: 2, damaged: 0 },
  { id: "CHR-002", name: "เก้าอี้พับ ชุด B (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, total: 4, available: 4, reserved: 0, damaged: 0 },
  { id: "ICE-001", name: "ถังน้ำแข็ง 20L", category: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false, total: 0, available: 0, reserved: 0, damaged: 0 },
];

type AdjustAction = "add" | "reduce" | "damaged" | "return";

import { useMemo } from "react";

const StockPage = () => {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAddon, setAdjustAddon] = useState<Addon | null>(null);
  const [adjustAction, setAdjustAction] = useState<AdjustAction>("add");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustSaving, setAdjustSaving] = useState(false);
  const { toast } = useToast();

  const filteredAddons = addons.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "low") return matchesSearch && a.available > 0 && a.available <= 2;
    if (statusFilter === "out") return matchesSearch && a.available === 0;
    return matchesSearch;
  });

  const totals = addons.reduce((acc, a) => ({
    total: acc.total + a.total,
    available: acc.available + a.available,
    reserved: acc.reserved + a.reserved,
    damaged: acc.damaged + a.damaged,
  }), { total: 0, available: 0, reserved: 0, damaged: 0 });

  const handleAdjustOpen = (addon: Addon) => {
    setAdjustAddon(addon);
    setAdjustAction("add");
    setAdjustQty(1);
    setAdjustOpen(true);
  };

  const adjustMaxQty = useMemo(() => {
    if (!adjustAddon) return 99;
    switch (adjustAction) {
      case "reduce": return adjustAddon.available;
      case "damaged": return adjustAddon.available;
      case "return": return adjustAddon.damaged;
      default: return 99;
    }
  }, [adjustAddon, adjustAction]);

  const adjustValidationMsg = useMemo(() => {
    if (!adjustAddon) return "";
    if (adjustQty > adjustMaxQty) {
      switch (adjustAction) {
        case "reduce": return `ไม่สามารถลดเกินจำนวนพร้อมใช้ (${adjustAddon.available})`;
        case "damaged": return `ไม่สามารถแจ้งชำรุดเกินจำนวนพร้อมใช้ (${adjustAddon.available})`;
        case "return": return `ไม่สามารถคืนเกินจำนวนชำรุด (${adjustAddon.damaged})`;
      }
    }
    return "";
  }, [adjustAddon, adjustAction, adjustQty, adjustMaxQty]);

  const adjustPreview = useMemo(() => {
    if (!adjustAddon) return null;
    const p = { available: adjustAddon.available, damaged: adjustAddon.damaged, total: adjustAddon.total };
    const qty = Math.min(adjustQty, adjustMaxQty);
    switch (adjustAction) {
      case "add": p.total += qty; p.available += qty; break;
      case "reduce": p.total -= qty; p.available -= qty; break;
      case "damaged": p.available -= qty; p.damaged += qty; break;
      case "return": p.damaged -= qty; p.available += qty; break;
    }
    return p;
  }, [adjustAddon, adjustAction, adjustQty, adjustMaxQty]);

  const handleAdjustSave = async () => {
    if (!adjustAddon || adjustValidationMsg) return;
    setAdjustSaving(true);
    await new Promise((r) => setTimeout(r, 500));
    setAddons((prev) => prev.map((a) => {
      if (a.id !== adjustAddon.id) return a;
      const updated = { ...a };
      const qty = Math.min(adjustQty, adjustMaxQty);
      switch (adjustAction) {
        case "add": updated.total += qty; updated.available += qty; break;
        case "reduce": updated.total -= qty; updated.available -= qty; break;
        case "damaged": updated.available -= qty; updated.damaged += qty; break;
        case "return": updated.damaged -= qty; updated.available += qty; break;
      }
      return updated;
    }));
    setAdjustSaving(false);
    setAdjustOpen(false);
    toast({ title: "สำเร็จ", description: "ปรับสต็อกเรียบร้อยแล้ว" });
  };

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "แชทลูกค้า", href: "/" },
    { icon: Car, label: "รถทั้งหมด", href: "/maintenance" },
    { icon: CalendarDays, label: "ปฏิทินราคารถ", href: "/" },
    { icon: Tent, label: "แคมป์ไซต์", href: "/" },
    { icon: Calendar, label: "การจอง", href: "/" },
    { icon: Users, label: "พาร์ทเนอร์", href: "/" },
    { icon: Users, label: "ลูกค้า", href: "/" },
    { icon: CreditCard, label: "การชำระเงิน", href: "/" },
    { icon: Tag, label: "จัดการโปรโมชั่น", href: "/" },
    { icon: Star, label: "รีวิว", href: "/" },
    { icon: FileText, label: "รายงาน", href: "/" },
    { icon: Database, label: "จัดการข้อมูล", href: "/" },
    { icon: Boxes, label: "Stock อุปกรณ์เสริม", href: "/stock", active: true },
    { icon: Package, label: "การจัดการ Add-on", href: "/addon-management" },
    { icon: Wrench, label: "ซ่อมบำรุง", href: "/maintenance" },
    { icon: Settings, label: "ตั้งค่า", href: "/" },
  ];

  const summaryCards = [
    { label: "รายการทั้งหมด", value: totals.total, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "พร้อมใช้งาน", value: totals.available, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "จองแล้ว", value: totals.reserved, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { label: "ชำรุด / ซ่อมบำรุง", value: totals.damaged, icon: Wrench, color: "text-destructive", bg: "bg-destructive/10" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="w-56 bg-primary text-primary-foreground flex flex-col">
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6" />
            <div>
              <h1 className="font-bold text-lg">RentCar Admin</h1>
              <p className="text-xs text-primary-foreground/70">จัดการระบบเช่ารถ</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2">
          <p className="text-xs text-primary-foreground/50 px-3 py-2">เมนูหลัก</p>
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-accent/20 text-primary-foreground rounded-r-lg border-l-4 border-accent"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">จัดการ Stock อุปกรณ์เสริม</h1>
            <p className="text-sm text-muted-foreground">บริหารจำนวนคงเหลือและสถานะอุปกรณ์ในคลัง</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">admin</span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {summaryCards.map((card) => (
            <Card key={card.label} className="p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.label}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหา Add-on..." className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="low">สต็อกน้อย</SelectItem>
                <SelectItem value="out">หมดสต็อก</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อ Add-on</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="text-center">ทั้งหมด</TableHead>
                <TableHead className="text-center">พร้อมใช้</TableHead>
                <TableHead className="text-center">จองแล้ว</TableHead>
                <TableHead className="text-center">ชำรุด</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{addon.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{addon.name}</p>
                      <p className="text-xs text-muted-foreground">{addon.defaultPrice.toLocaleString()} บาท</p>
                    </div>
                  </TableCell>
                  <TableCell><Badge variant="outline">{addon.category}</Badge></TableCell>
                  <TableCell className="text-center font-semibold">{addon.total}</TableCell>
                  <TableCell className="text-center"><span className="text-success font-semibold">{addon.available}</span></TableCell>
                  <TableCell className="text-center"><span className="text-warning font-semibold">{addon.reserved}</span></TableCell>
                  <TableCell className="text-center"><span className="text-destructive font-semibold">{addon.damaged}</span></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" onClick={() => handleAdjustOpen(addon)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredAddons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล Add-on</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ปรับสต็อก — {adjustAddon?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {adjustAddon && (
              <div className="grid grid-cols-4 gap-3 rounded-lg bg-muted/50 p-3">
                {[
                  { label: "ทั้งหมด", value: adjustAddon.total, cls: "text-foreground" },
                  { label: "พร้อมใช้", value: adjustAddon.available, cls: "text-success" },
                  { label: "จองแล้ว", value: adjustAddon.reserved, cls: "text-warning" },
                  { label: "ชำรุด", value: adjustAddon.damaged, cls: "text-destructive" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className={`text-lg font-bold ${s.cls}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="space-y-2">
              <Label>ประเภทการปรับ</Label>
              <Select value={adjustAction} onValueChange={(v) => { setAdjustAction(v as AdjustAction); setAdjustQty(1); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">เพิ่มสต็อก</SelectItem>
                  <SelectItem value="reduce">ลดสต็อก</SelectItem>
                  <SelectItem value="damaged">แจ้งชำรุด</SelectItem>
                  <SelectItem value="return">คืนจากซ่อม</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>จำนวน</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(Math.max(1, adjustQty - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input type="number" min={1} max={adjustMaxQty} value={adjustQty} onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))} className="text-center w-20" />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(adjustQty + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {adjustValidationMsg && <p className="text-xs text-destructive">{adjustValidationMsg}</p>}
            </div>
            {adjustAddon && adjustPreview && !adjustValidationMsg && (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3 space-y-1">
                <p className="text-xs font-semibold text-muted-foreground mb-2">หลังปรับสต็อก:</p>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">Total:</span>
                  <span>{adjustAddon.total}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold">{adjustPreview.total}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">Available:</span>
                  <span className="text-success">{adjustAddon.available}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold text-success">{adjustPreview.available}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground w-16">Damaged:</span>
                  <span className="text-destructive">{adjustAddon.damaged}</span>
                  <span className="text-muted-foreground">→</span>
                  <span className="font-semibold text-destructive">{adjustPreview.damaged}</span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAdjustSave} disabled={adjustSaving || !!adjustValidationMsg}>
              {adjustSaving ? "กำลังบันทึก..." : "บันทึก"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockPage;
