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
  Car, Search, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, CheckCircle, AlertTriangle, Wrench,
  ChevronDown, ChevronRight, Pencil,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddons, type Addon, type StockStatus } from "@/contexts/AddonContext";

const getStatusLabel = (s: StockStatus) => {
  switch (s) {
    case "available": return "พร้อมใช้";
    case "reserved": return "ถูกจอง";
    case "damaged": return "ส่งซ่อม";
    case "broken": return "ชำรุด";
  }
};

const getStatusBadge = (s: StockStatus) => {
  switch (s) {
    case "available": return <Badge className="bg-success/10 text-success border-success/20">พร้อมใช้</Badge>;
    case "reserved": return <Badge className="bg-warning/10 text-warning border-warning/20">ถูกจอง</Badge>;
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
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAddon, setAdjustAddon] = useState<Addon | null>(null);
  const [newStatus, setNewStatus] = useState<StockStatus>("available");
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
    const groups: Record<string, { category: string; total: number; available: number; reserved: number; damaged: number; broken: number; items: Addon[] }> = {};
    filteredAddons.forEach((a) => {
      if (!groups[a.category]) {
        groups[a.category] = { category: a.category, total: 0, available: 0, reserved: 0, damaged: 0, broken: 0, items: [] };
      }
      groups[a.category].total += 1;
      if (a.stockStatus === "available") groups[a.category].available += 1;
      if (a.stockStatus === "reserved") groups[a.category].reserved += 1;
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
      damaged: acc.damaged + (a.stockStatus === "damaged" ? 1 : 0),
      broken: acc.broken + (a.stockStatus === "broken" ? 1 : 0),
    }), { total: 0, available: 0, reserved: 0, damaged: 0, broken: 0 });
  }, [addons]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  };

  const handleAdjustOpen = (addon: Addon) => {
    setAdjustAddon(addon);
    setNewStatus(addon.stockStatus);
    setAdjustOpen(true);
  };

  const handleAdjustSave = () => {
    if (!adjustAddon) return;
    setAddons((prev) => prev.map((a) => a.id === adjustAddon.id ? { ...a, stockStatus: newStatus } : a));
    setAdjustOpen(false);
    toast({ title: "สำเร็จ", description: `เปลี่ยนสถานะ ${adjustAddon.name} เป็น "${getStatusLabel(newStatus)}" แล้ว` });
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
                <SelectItem value="damaged">ส่งซ่อม</SelectItem>
                <SelectItem value="broken">ชำรุด</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>หมวดหมู่อุปกรณ์</TableHead>
                <TableHead className="text-center">จำนวน</TableHead>
                <TableHead className="text-center">พร้อมใช้</TableHead>
                <TableHead className="text-center">ถูกจอง</TableHead>
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
                      <TableCell className="text-center font-semibold">{group.total}</TableCell>
                      <TableCell className="text-center"><span className="text-success font-semibold">{group.available}</span></TableCell>
                      <TableCell className="text-center"><span className="text-warning font-semibold">{group.reserved}</span></TableCell>
                      <TableCell className="text-center"><span className="text-destructive font-semibold">{group.damaged}</span></TableCell>
                      <TableCell className="text-center"><span className="text-muted-foreground font-semibold">{group.broken}</span></TableCell>
                    </TableRow>
                    {isExpanded && group.items.map((addon) => (
                      <TableRow key={addon.id} className="bg-muted/30">
                        <TableCell></TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm font-medium">{addon.name}</p>
                            <p className="text-xs text-muted-foreground">{addon.id} · {addon.defaultPrice.toLocaleString()} บาท</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(addon.stockStatus)}</TableCell>
                        <TableCell colSpan={3}></TableCell>
                        <TableCell className="text-center">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-warning" onClick={(e) => { e.stopPropagation(); handleAdjustOpen(addon); }}>
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })}
              {groupedByCategory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </main>

      {/* Adjust Status Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>เปลี่ยนสถานะ — {adjustAddon?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {adjustAddon && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="font-semibold text-sm">{adjustAddon.name}</p>
                  <p className="text-xs text-muted-foreground">{adjustAddon.id}</p>
                </div>
                <div className="ml-auto">{getStatusBadge(adjustAddon.stockStatus)}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label>เปลี่ยนเป็นสถานะ</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as StockStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">พร้อมใช้</SelectItem>
                  <SelectItem value="reserved">ถูกจอง</SelectItem>
                  <SelectItem value="damaged">ส่งซ่อม</SelectItem>
                  <SelectItem value="broken">ชำรุด</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {adjustAddon && newStatus !== adjustAddon.stockStatus && (
              <div className="rounded-lg border border-border/50 bg-muted/30 p-3">
                <div className="flex items-center gap-2 text-sm">
                  {getStatusBadge(adjustAddon.stockStatus)}
                  <span className="text-muted-foreground">→</span>
                  {getStatusBadge(newStatus)}
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAdjustSave} disabled={adjustAddon?.stockStatus === newStatus}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockPage;
