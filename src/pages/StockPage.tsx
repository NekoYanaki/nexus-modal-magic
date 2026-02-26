import { useState, useMemo } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Addon {
  id: string;
  name: string;
  defaultPrice: number;
  isActive: boolean;
  total: number;
  available: number;
  reserved: number;
  damaged: number;
}

const mockAddons: Addon[] = [
  { id: "AD0001", name: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, total: 10, available: 5, reserved: 3, damaged: 2 },
  { id: "AD0002", name: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, total: 15, available: 10, reserved: 4, damaged: 1 },
  { id: "AD0003", name: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true, total: 8, available: 8, reserved: 0, damaged: 0 },
  { id: "AD0004", name: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true, total: 3, available: 1, reserved: 1, damaged: 1 },
  { id: "AD0005", name: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true, total: 6, available: 6, reserved: 0, damaged: 0 },
  { id: "AD0006", name: "เก้าอี้พับ (ชุด)", defaultPrice: 300, isActive: true, total: 12, available: 8, reserved: 4, damaged: 0 },
  { id: "AD0007", name: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false, total: 0, available: 0, reserved: 0, damaged: 0 },
];

type AdjustAction = "add" | "reduce" | "damaged" | "return";

const StockPage = () => {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Add/Edit dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ name: "", defaultPrice: 0, isActive: true });

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState<Addon | null>(null);

  // Adjust stock dialog
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAddon, setAdjustAddon] = useState<Addon | null>(null);
  const [adjustAction, setAdjustAction] = useState<AdjustAction>("add");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustNote, setAdjustNote] = useState("");
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

  const getStatus = (addon: Addon) => {
    if (!addon.isActive || addon.total === 0) return "out";
    if (addon.available <= 2) return "low";
    return "ok";
  };

  const handleAdd = () => {
    setEditingAddon(null);
    setFormData({ name: "", defaultPrice: 0, isActive: true });
    setDialogOpen(true);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({ name: addon.name, defaultPrice: addon.defaultPrice, isActive: addon.isActive });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editingAddon) {
      setAddons((prev) => prev.map((a) => a.id === editingAddon.id ? { ...a, ...formData } : a));
    } else {
      const newId = `AD${String(addons.length + 1).padStart(4, "0")}`;
      setAddons((prev) => [...prev, { id: newId, ...formData, total: 0, available: 0, reserved: 0, damaged: 0 }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingAddon) setAddons((prev) => prev.filter((a) => a.id !== deletingAddon.id));
    setDeleteDialogOpen(false);
    setDeletingAddon(null);
  };

  const handleAdjustOpen = (addon: Addon) => {
    setAdjustAddon(addon);
    setAdjustAction("add");
    setAdjustQty(1);
    setAdjustNote("");
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
    { icon: Boxes, label: "Stock / Add-on", href: "/stock", active: true },
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
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">จัดการ Stock อุปกรณ์เสริม</h1>
            <p className="text-sm text-muted-foreground">บริหารจำนวนคงเหลือและสถานะอุปกรณ์ในคลัง</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">admin</span>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
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

        {/* Table */}
        <Card className="p-6">
          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหา Add-on..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="สถานะ" />
              </SelectTrigger>
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
                <TableHead>ชื่อ Add-on</TableHead>
                <TableHead className="text-center">ทั้งหมด</TableHead>
                <TableHead className="text-center">พร้อมใช้</TableHead>
                <TableHead className="text-center">จองแล้ว</TableHead>
                <TableHead className="text-center">ชำรุด</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => {
                const status = getStatus(addon);
                return (
                  <TableRow key={addon.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{addon.name}</p>
                        <p className="text-xs text-muted-foreground">{addon.id} · {addon.defaultPrice.toLocaleString()} บาท</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{addon.total}</TableCell>
                    <TableCell className="text-center">
                      <span className="text-success font-semibold">{addon.available}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-warning font-semibold">{addon.reserved}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-destructive font-semibold">{addon.damaged}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" onClick={() => handleAdjustOpen(addon)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingAddon(addon); setDeleteDialogOpen(true); }}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAddons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล Add-on</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddon ? "แก้ไข Add-on" : "เพิ่ม Add-on"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ชื่อ Add-on</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="เช่น เบาะนั่งเด็ก" />
            </div>
            <div className="space-y-2">
              <Label>ราคาเริ่มต้น (บาท)</Label>
              <Input type="number" value={formData.defaultPrice} onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>{editingAddon ? "บันทึก" : "เพิ่ม"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ยืนยันการลบ</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            คุณต้องการลบ <span className="font-semibold text-foreground">{deletingAddon?.name}</span> ออกจากระบบหรือไม่?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>ยกเลิก</Button>
            <Button variant="destructive" onClick={handleDelete}>ลบ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ปรับสต็อก — {adjustAddon?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            {/* Current Stock Summary */}
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

            {/* Adjustment Type */}
            <div className="space-y-2">
              <Label>ประเภทการปรับ</Label>
              <Select value={adjustAction} onValueChange={(v) => { setAdjustAction(v as AdjustAction); setAdjustQty(1); }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">เพิ่มสต็อก</SelectItem>
                  <SelectItem value="reduce">ลดสต็อก</SelectItem>
                  <SelectItem value="damaged">แจ้งชำรุด</SelectItem>
                  <SelectItem value="return">คืนจากซ่อม</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>จำนวน</Label>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(Math.max(1, adjustQty - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  max={adjustMaxQty}
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))}
                  className="text-center w-20"
                />
                <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(adjustQty + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {adjustValidationMsg && (
                <p className="text-xs text-destructive">{adjustValidationMsg}</p>
              )}
            </div>

            {/* Preview */}
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
