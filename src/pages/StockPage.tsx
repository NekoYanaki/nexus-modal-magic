import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import { Switch } from "@/components/ui/switch";
import {
  Car, Search, Plus, Pencil, Trash2, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, CheckCircle, AlertTriangle, Wrench,
  ChevronDown, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddons, type Addon, type StockStatus } from "@/contexts/AddonContext";

const getStatusLabel = (s: StockStatus) => {
  switch (s) {
    case "available": return "พร้อมใช้";
    case "reserved": return "ถูกจอง";
    case "in_use": return "ถูกใช้";
    case "damaged": return "ส่งซ่อม";
    case "broken": return "ชำรุด";
  }
};

const getStatusBadge = (s: StockStatus, bookingRef?: string) => {
  switch (s) {
    case "available": return <Badge className="bg-success/10 text-success border-success/20">พร้อมใช้</Badge>;
    case "reserved": {
      const badge = <Badge className="bg-warning/10 text-warning border-warning/20 cursor-default">ถูกจอง</Badge>;
      return bookingRef ? (
        <TooltipProvider delayDuration={0}><Tooltip><TooltipTrigger asChild><span className="inline-flex">{badge}</span></TooltipTrigger><TooltipContent><p className="font-mono text-xs">Booking: {bookingRef}</p></TooltipContent></Tooltip></TooltipProvider>
      ) : badge;
    }
    case "in_use": {
      const badge = <Badge className="bg-primary/10 text-primary border-primary/20 cursor-default">ถูกใช้</Badge>;
      return bookingRef ? (
        <TooltipProvider delayDuration={0}><Tooltip><TooltipTrigger asChild><span className="inline-flex">{badge}</span></TooltipTrigger><TooltipContent><p className="font-mono text-xs">Booking: {bookingRef}</p></TooltipContent></Tooltip></TooltipProvider>
      ) : badge;
    }
    case "damaged": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">ส่งซ่อม</Badge>;
    case "broken": return <Badge className="bg-muted text-muted-foreground border-muted-foreground/20">ชำรุด</Badge>;
  }
};

const StockPage = () => {
  const { addons, setAddons } = useAddons();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available" as Addon["stockStatus"], bookingRef: "" });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState<Addon | null>(null);
  const { toast } = useToast();

  const categories = useMemo(() => {
    return Array.from(new Set(addons.map((a) => a.category))).sort();
  }, [addons]);

  const filteredAddons = addons.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase()) || a.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || a.stockStatus === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, { category: string; total: number; available: number; reserved: number; in_use: number; damaged: number; broken: number; items: Addon[] }> = {};
    filteredAddons.forEach((a) => {
      if (!groups[a.category]) {
        groups[a.category] = { category: a.category, total: 0, available: 0, reserved: 0, in_use: 0, damaged: 0, broken: 0, items: [] };
      }
      groups[a.category].total += 1;
      if (a.stockStatus === "available") groups[a.category].available += 1;
      if (a.stockStatus === "reserved") groups[a.category].reserved += 1;
      if (a.stockStatus === "in_use") groups[a.category].in_use += 1;
      if (a.stockStatus === "damaged") groups[a.category].damaged += 1;
      if (a.stockStatus === "broken") groups[a.category].broken += 1;
      groups[a.category].items.push(a);
    });
    return Object.values(groups).sort((a, b) => a.category.localeCompare(b.category));
  }, [filteredAddons]);

  const totals = useMemo(() => {
    return addons.reduce((acc, a) => ({
      total: acc.total + 1,
      available: acc.available + (a.stockStatus === "available" ? 1 : 0),
      reserved: acc.reserved + (a.stockStatus === "reserved" ? 1 : 0),
      in_use: acc.in_use + (a.stockStatus === "in_use" ? 1 : 0),
      damaged: acc.damaged + (a.stockStatus === "damaged" ? 1 : 0),
      broken: acc.broken + (a.stockStatus === "broken" ? 1 : 0),
    }), { total: 0, available: 0, reserved: 0, in_use: 0, damaged: 0, broken: 0 });
  }, [addons]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const handleAdd = () => {
    setEditingAddon(null);
    setFormData({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available", bookingRef: "" });
    setDialogOpen(true);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({ id: addon.id, name: addon.name, category: addon.category, defaultPrice: addon.defaultPrice, isActive: addon.isActive, stockStatus: addon.stockStatus, bookingRef: addon.bookingRef || "" });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.id.trim()) {
      toast({ title: "กรุณากรอกรหัส Add-on", variant: "destructive" });
      return;
    }
    if (!formData.name.trim()) {
      toast({ title: "กรุณากรอกชื่อ Add-on", variant: "destructive" });
      return;
    }
    if (editingAddon) {
      setAddons((prev) => prev.map((a) => a.id === editingAddon.id ? { ...a, ...formData, bookingRef: formData.bookingRef || undefined } : a));
      toast({ title: "สำเร็จ", description: "แก้ไข Add-on เรียบร้อยแล้ว" });
    } else {
      if (addons.some((a) => a.id === formData.id)) {
        toast({ title: "รหัสนี้มีอยู่แล้ว", variant: "destructive" });
        return;
      }
      setAddons((prev) => [...prev, { ...formData, bookingRef: formData.bookingRef || undefined }]);
      toast({ title: "สำเร็จ", description: "เพิ่ม Add-on เรียบร้อยแล้ว" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingAddon) {
      setAddons((prev) => prev.filter((a) => a.id !== deletingAddon.id));
      toast({ title: "สำเร็จ", description: "ลบ Add-on เรียบร้อยแล้ว" });
    }
    setDeleteDialogOpen(false);
    setDeletingAddon(null);
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
    { icon: Boxes, label: "การจัดการ Add-on", href: "/addon", active: true },
    { icon: Package, label: "Stock อุปกรณ์เสริม", href: "/stock" },
    { icon: Wrench, label: "ซ่อมบำรุง", href: "/maintenance" },
    { icon: Settings, label: "ตั้งค่า", href: "/" },
  ];

  const summaryCards = [
    { label: "รายการทั้งหมด", value: totals.total, icon: Package, color: "text-primary", bg: "bg-primary/10" },
    { label: "พร้อมใช้งาน", value: totals.available, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
    { label: "ถูกจอง", value: totals.reserved, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
    { label: "ถูกใช้", value: totals.in_use, icon: Car, color: "text-primary", bg: "bg-primary/10" },
    { label: "ส่งซ่อม / ชำรุด", value: totals.damaged + totals.broken, icon: Wrench, color: "text-destructive", bg: "bg-destructive/10" },
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
            <h1 className="text-2xl font-bold">การจัดการ Add-on</h1>
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

        <div className="grid grid-cols-5 gap-4 mb-6">
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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="available">พร้อมใช้</SelectItem>
                <SelectItem value="reserved">ถูกจอง</SelectItem>
                <SelectItem value="in_use">ถูกใช้</SelectItem>
                <SelectItem value="damaged">ส่งซ่อม</SelectItem>
                <SelectItem value="broken">ชำรุด</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end mb-4">
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่ม Add-on
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>หมวดหมู่อุปกรณ์</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-center">จำนวน</TableHead>
                <TableHead className="text-center">พร้อมใช้</TableHead>
                <TableHead className="text-center">ถูกจอง</TableHead>
                <TableHead className="text-center">ถูกใช้</TableHead>
                <TableHead className="text-center">ส่งซ่อม</TableHead>
                <TableHead className="text-center">ชำรุด</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedByCategory.map((group) => {
                const isExpanded = expandedCategories.has(group.category);
                return (
                  <>
                    <TableRow key={group.category} className="cursor-pointer hover:bg-muted/50" onClick={() => toggleCategory(group.category)}>
                      <TableCell className="w-8 px-2">
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                      </TableCell>
                      <TableCell>
                        <p className="font-semibold">{group.category}</p>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell className="text-center font-semibold">{group.total}</TableCell>
                      <TableCell className="text-center"><span className="text-success font-semibold">{group.available}</span></TableCell>
                      <TableCell className="text-center"><span className="text-warning font-semibold">{group.reserved}</span></TableCell>
                      <TableCell className="text-center"><span className="text-primary font-semibold">{group.in_use}</span></TableCell>
                      <TableCell className="text-center"><span className="text-destructive font-semibold">{group.damaged}</span></TableCell>
                      <TableCell className="text-center"><span className="text-muted-foreground font-semibold">{group.broken}</span></TableCell>
                    </TableRow>
                    {isExpanded && group.items.map((addon) => (
                      <TableRow key={addon.id} className="bg-muted/30">
                        <TableCell></TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{addon.name}</p>
                            <p className="text-xs text-muted-foreground">{addon.id}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm font-medium">฿{addon.defaultPrice.toLocaleString()}</TableCell>
                        <TableCell className="text-center">{getStatusBadge(addon.stockStatus, addon.bookingRef)}</TableCell>
                        <TableCell colSpan={4}></TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-warning" onClick={(e) => { e.stopPropagation(); handleEdit(addon); }}>
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={(e) => { e.stopPropagation(); setDeletingAddon(addon); setDeleteDialogOpen(true); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })}
              {groupedByCategory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล</TableCell>
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
              <Label>รหัส Add-on</Label>
              <Input value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="เช่น GEN-001" disabled={!!editingAddon} />
              {editingAddon && <p className="text-xs text-muted-foreground">ไม่สามารถแก้ไขรหัสได้</p>}
            </div>
            <div className="space-y-2">
              <Label>ชื่อ Add-on</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="เช่น เครื่องปั่นไฟ Honda 3kW" />
            </div>
            <div className="space-y-2">
              <Label>หมวดหมู่</Label>
              <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="เช่น เครื่องปั่นไฟ" />
            </div>
            <div className="space-y-2">
              <Label>สถานะการใช้งาน</Label>
              <Select value={formData.stockStatus} onValueChange={(v) => setFormData({ ...formData, stockStatus: v as Addon["stockStatus"], bookingRef: (v === "available" || v === "damaged" || v === "broken") ? "" : formData.bookingRef })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">พร้อมใช้</SelectItem>
                  <SelectItem value="reserved">ถูกจอง</SelectItem>
                  <SelectItem value="in_use">ถูกใช้</SelectItem>
                  <SelectItem value="damaged">ส่งซ่อม</SelectItem>
                  <SelectItem value="broken">ชำรุด</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {(formData.stockStatus === "reserved" || formData.stockStatus === "in_use") && (
              <div className="space-y-2">
                <Label>รหัสการจอง (Booking Ref)</Label>
                <Input value={formData.bookingRef} onChange={(e) => setFormData({ ...formData, bookingRef: e.target.value })} placeholder="เช่น BK002" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label>เปิดใช้งาน</Label>
              <Switch checked={formData.isActive} onCheckedChange={(v) => setFormData({ ...formData, isActive: v })} />
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
    </div>
  );
};

export default StockPage;
