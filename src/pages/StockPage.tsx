import { useState } from "react";
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
  Car, Search, Plus, Pencil, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, Wrench, CheckCircle, AlertTriangle,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddons, type Addon, type StockStatus } from "@/contexts/AddonContext";

const ITEMS_PER_PAGE = 10;

const Pagination = ({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (p: number) => void }) => {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <p className="text-sm text-muted-foreground">หน้า {currentPage} / {totalPages}</p>
      <div className="flex items-center gap-1">
        <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button key={p} variant={p === currentPage ? "default" : "outline"} size="sm" className="w-8" onClick={() => onPageChange(p)}>
            {p}
          </Button>
        ))}
        <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const StockPage = () => {
  const { addons, setAddons, addonTypes } = useAddons();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [kindFilter, setKindFilter] = useState("all");
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustAddon, setAdjustAddon] = useState<Addon | null>(null);
  const [newStatus, setNewStatus] = useState<StockStatus>("available");
  const [newBookingRef, setNewBookingRef] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newIsActive, setNewIsActive] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available" as StockStatus, bookingRef: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  // Only equipment items (exclude consumables)
  const equipmentAddons = addons.filter((a) => {
    const addonType = addonTypes.find((t) => t.name === a.category);
    return addonType?.kind !== "consumable";
  });

  const categories = Array.from(new Set(equipmentAddons.map((a) => a.category))).sort();

  const filteredAddons = equipmentAddons.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    const matchesActive = activeFilter === "all" || (activeFilter === "active" ? a.isActive : !a.isActive);
    return matchesSearch && matchesCategory && matchesActive;
  });

  const totalPages = Math.ceil(filteredAddons.length / ITEMS_PER_PAGE);
  const pagedAddons = filteredAddons.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleAdjustOpen = (addon: Addon) => {
    setAdjustAddon(addon);
    setNewStatus(addon.stockStatus);
    setNewBookingRef(addon.bookingRef || "");
    setNewCategory(addon.category);
    setNewPrice(String(addon.defaultPrice));
    setNewIsActive(addon.isActive);
    setAdjustOpen(true);
  };

  const handleAdjustSave = () => {
    if (!adjustAddon) return;
    setAddons((prev) => prev.map((a) => a.id === adjustAddon.id ? { ...a, category: newCategory, defaultPrice: Number(newPrice) || 0, isActive: newIsActive, stockStatus: newStatus, bookingRef: (newStatus === "reserved" || newStatus === "in_use") ? newBookingRef || undefined : undefined } : a));
    setAdjustOpen(false);
    toast({ title: "สำเร็จ", description: `แก้ไขอุปกรณ์ ${adjustAddon.name} แล้ว` });
  };

  const handleAddOpen = () => {
    setAddFormData({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available", bookingRef: "" });
    setAddOpen(true);
  };

  const handleAddSave = () => {
    if (!addFormData.id.trim()) { toast({ title: "กรุณากรอกรหัส", variant: "destructive" }); return; }
    if (!addFormData.name.trim()) { toast({ title: "กรุณากรอกชื่อ", variant: "destructive" }); return; }
    if (addons.some((a) => a.id === addFormData.id)) { toast({ title: "รหัสนี้มีอยู่แล้ว", variant: "destructive" }); return; }
    setAddons((prev) => [...prev, { ...addFormData, bookingRef: addFormData.bookingRef || undefined }]);
    setAddOpen(false);
    toast({ title: "สำเร็จ", description: "เพิ่มสินค้าเรียบร้อยแล้ว" });
  };

  const availableCount = equipmentAddons.filter((a) => a.stockStatus === "available").length;
  const reservedCount = equipmentAddons.filter((a) => a.stockStatus === "reserved").length;
  const inUseCount = equipmentAddons.filter((a) => a.stockStatus === "in_use").length;
  const damagedBrokenCount = equipmentAddons.filter((a) => a.stockStatus === "damaged" || a.stockStatus === "broken").length;

  const getStockStatusBadge = (status: Addon["stockStatus"], bookingRef?: string) => {
    switch (status) {
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
    { icon: Boxes, label: "การจัดการ Add-on", href: "/addon" },
    { icon: Package, label: "Stock อุปกรณ์เสริม", href: "/stock", active: true },
    { icon: Wrench, label: "ซ่อมบำรุง", href: "/maintenance" },
    { icon: Settings, label: "ตั้งค่า", href: "/" },
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
            <h1 className="text-2xl font-bold">Stock อุปกรณ์เสริม</h1>
            <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข ลบ และจัดการสถานะรายการอุปกรณ์เสริม</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleAddOpen} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่มสินค้า
            </Button>
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">admin</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{equipmentAddons.length}</p>
              <p className="text-xs text-muted-foreground">ทั้งหมด</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/10">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{availableCount}</p>
              <p className="text-xs text-muted-foreground">พร้อมใช้</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-warning/10">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">{reservedCount}</p>
              <p className="text-xs text-muted-foreground">ถูกจอง</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
              <Car className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{inUseCount}</p>
              <p className="text-xs text-muted-foreground">ถูกใช้</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/10">
              <Wrench className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold text-destructive">{damagedBrokenCount}</p>
              <p className="text-xs text-muted-foreground">ซ่อม/ชำรุด</p>
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="ค้นหา Add-on..." className="pl-10" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-48"><SelectValue placeholder="หมวดหมู่" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกหมวดหมู่</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={activeFilter} onValueChange={(v) => { setActiveFilter(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">เปิดใช้งาน</SelectItem>
                <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อ Add-on</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-center">สถานะการใช้งาน</TableHead>
                <TableHead className="text-center">สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagedAddons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{addon.id}</TableCell>
                  <TableCell className="font-semibold">{addon.name}</TableCell>
                  <TableCell><Badge variant="outline">{addon.category}</Badge></TableCell>
                  <TableCell className="text-center">
                    <Badge variant={getKindVariant(addon.category)} className="text-xs">
                      {getKindLabel(addon.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">฿{addon.defaultPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {getStockStatusBadge(addon.stockStatus, addon.bookingRef)}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={addon.isActive ? "default" : "secondary"}>
                      {addon.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Badge>
                  </TableCell>
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </Card>
      </main>

      {/* Edit Dialog */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>แก้ไขอุปกรณ์</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {adjustAddon && (
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div>
                  <p className="font-semibold text-sm">{adjustAddon.name}</p>
                  <p className="text-xs text-muted-foreground">{adjustAddon.id}</p>
                </div>
                <div className="ml-auto">{getStockStatusBadge(adjustAddon.stockStatus, adjustAddon.bookingRef)}</div>
              </div>
            )}
            <div className="space-y-2">
              <Label>หมวดหมู่</Label>
              <Select value={newCategory} onValueChange={setNewCategory}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ราคา (บาท)</Label>
              <Input type="number" min={0} value={newPrice} readOnly disabled className="bg-muted cursor-not-allowed" placeholder="เช่น 300" />
            </div>
            <div className="space-y-2">
              <Label>เปลี่ยนเป็นสถานะ</Label>
              <Select value={newStatus} onValueChange={(v) => setNewStatus(v as StockStatus)}>
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
            {(newStatus === "reserved" || newStatus === "in_use") && (
              <div className="space-y-2">
                <Label>รหัสการจอง (Booking Ref)</Label>
                <Input value={newBookingRef} readOnly disabled className="bg-muted/50 cursor-not-allowed" placeholder="—" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label>เปิดใช้งาน</Label>
              <Switch checked={newIsActive} onCheckedChange={setNewIsActive} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjustOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAdjustSave}>บันทึก</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Item Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>หมวดหมู่</Label>
              <Select value={addFormData.category} onValueChange={(v) => {
                const masterItem = addons.find((a) => a.category === v);
                setAddFormData({ ...addFormData, category: v, defaultPrice: masterItem?.defaultPrice ?? addFormData.defaultPrice });
              }}>
                <SelectTrigger><SelectValue placeholder="เลือกหมวดหมู่" /></SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>รหัสสินค้า</Label>
              <Input value={addFormData.id} onChange={(e) => setAddFormData({ ...addFormData, id: e.target.value })} placeholder="เช่น GEN-004" />
            </div>
            <div className="space-y-2">
              <Label>ชื่อสินค้า</Label>
              <Input value={addFormData.name} onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })} placeholder="เช่น เครื่องปั่นไฟ Honda 3kW" />
            </div>
            <div className="space-y-2">
              <Label>ราคา (บาท)</Label>
              <Input type="number" min={0} value={addFormData.defaultPrice} onChange={(e) => setAddFormData({ ...addFormData, defaultPrice: Number(e.target.value) })} placeholder="เช่น 300" />
            </div>
            <div className="space-y-2">
              <Label>สถานะ</Label>
              <Select value={addFormData.stockStatus} onValueChange={(v) => setAddFormData({ ...addFormData, stockStatus: v as StockStatus })}>
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
            {(addFormData.stockStatus === "reserved" || addFormData.stockStatus === "in_use") && (
              <div className="space-y-2">
                <Label>รหัสการจอง (Booking Ref)</Label>
                <Input value={addFormData.bookingRef} onChange={(e) => setAddFormData({ ...addFormData, bookingRef: e.target.value })} placeholder="เช่น BK002" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <Label>เปิดใช้งาน</Label>
              <Switch checked={addFormData.isActive} onCheckedChange={(v) => setAddFormData({ ...addFormData, isActive: v })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleAddSave}>เพิ่ม</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockPage;
