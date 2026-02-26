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
import { Switch } from "@/components/ui/switch";
import {
  Car, Search, Plus, Pencil, Trash2, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface Addon {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  isActive: boolean;
  stockStatus: "available" | "reserved" | "damaged";
}

const mockAddons: Addon[] = [
  { id: "SEAT-001", name: "เบาะนั่งเด็ก ตัวที่ 1", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "available" },
  { id: "SEAT-002", name: "เบาะนั่งเด็ก ตัวที่ 2", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "reserved" },
  { id: "SEAT-003", name: "เบาะนั่งเด็ก ตัวที่ 3", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "available" },
  { id: "CAMP-001", name: "ชุดแคมปิ้ง A", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, stockStatus: "reserved" },
  { id: "CAMP-002", name: "ชุดแคมปิ้ง B", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, stockStatus: "available" },
  { id: "BBQ-001", name: "ชุดปิ้งย่างใหญ่", category: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true, stockStatus: "available" },
  { id: "BBQ-002", name: "ชุดปิ้งย่างเล็ก", category: "ชุดปิ้งย่าง", defaultPrice: 100, isActive: true, stockStatus: "available" },
  { id: "GEN-001", name: "เครื่องปั่นไฟ Honda 3kW", category: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true, stockStatus: "reserved" },
  { id: "GEN-002", name: "เครื่องปั่นไฟ Yamaha 2kW", category: "เครื่องปั่นไฟ", defaultPrice: 25000, isActive: true, stockStatus: "available" },
  { id: "GEN-003", name: "เครื่องปั่นไฟ Honda 5kW", category: "เครื่องปั่นไฟ", defaultPrice: 45000, isActive: false, stockStatus: "damaged" },
  { id: "TBL-001", name: "โต๊ะกลางแจ้ง 6 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true, stockStatus: "available" },
  { id: "TBL-002", name: "โต๊ะกลางแจ้ง 4 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 400, isActive: true, stockStatus: "reserved" },
  { id: "CHR-001", name: "เก้าอี้พับ ชุด A (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, stockStatus: "reserved" },
  { id: "CHR-002", name: "เก้าอี้พับ ชุด B (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, stockStatus: "available" },
  { id: "ICE-001", name: "ถังน้ำแข็ง 20L", category: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false, stockStatus: "damaged" },
];

const AddonManagementPage = () => {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available" as Addon["stockStatus"] });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState<Addon | null>(null);
  const { toast } = useToast();

  const categories = Array.from(new Set(addons.map((a) => a.category))).sort();

  const filteredAddons = addons.filter((a) => {
    const matchesSearch = a.name.toLowerCase().includes(searchQuery.toLowerCase()) || a.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || a.category === categoryFilter;
    if (activeFilter === "active") return matchesSearch && matchesCategory && a.isActive;
    if (activeFilter === "inactive") return matchesSearch && matchesCategory && !a.isActive;
    return matchesSearch && matchesCategory;
  });

  const handleAdd = () => {
    setEditingAddon(null);
    setFormData({ id: "", name: "", category: "", defaultPrice: 0, isActive: true, stockStatus: "available" });
    setDialogOpen(true);
  };

  const handleEdit = (addon: Addon) => {
    setEditingAddon(addon);
    setFormData({ id: addon.id, name: addon.name, category: addon.category, defaultPrice: addon.defaultPrice, isActive: addon.isActive, stockStatus: addon.stockStatus });
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
      setAddons((prev) => prev.map((a) => a.id === editingAddon.id ? { ...a, ...formData } : a));
      toast({ title: "สำเร็จ", description: "แก้ไข Add-on เรียบร้อยแล้ว" });
    } else {
      if (addons.some((a) => a.id === formData.id)) {
        toast({ title: "รหัสนี้มีอยู่แล้ว", variant: "destructive" });
        return;
      }
      setAddons((prev) => [...prev, { ...formData }]);
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

  const handleToggleActive = (addon: Addon) => {
    setAddons((prev) => prev.map((a) => a.id === addon.id ? { ...a, isActive: !a.isActive } : a));
    toast({
      title: addon.isActive ? "ปิดใช้งาน" : "เปิดใช้งาน",
      description: `${addon.name} ${addon.isActive ? "ถูกปิดใช้งานแล้ว" : "ถูกเปิดใช้งานแล้ว"}`,
    });
  };

  const activeCount = addons.filter((a) => a.isActive).length;
  const inactiveCount = addons.filter((a) => !a.isActive).length;

  const getStockStatusBadge = (status: Addon["stockStatus"]) => {
    switch (status) {
      case "available": return <Badge className="bg-success/10 text-success border-success/20">พร้อมใช้</Badge>;
      case "reserved": return <Badge className="bg-warning/10 text-warning border-warning/20">ถูกจอง</Badge>;
      case "damaged": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">ส่งซ่อม</Badge>;
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
    { icon: Boxes, label: "Stock อุปกรณ์เสริม", href: "/stock" },
    { icon: Package, label: "การจัดการ Add-on", href: "/addon-management", active: true },
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
            <h1 className="text-2xl font-bold">การจัดการ Add-on</h1>
            <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข ลบ และจัดการสถานะรายการอุปกรณ์เสริม</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">admin</span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{addons.length}</p>
              <p className="text-xs text-muted-foreground">Add-on ทั้งหมด</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-success/10">
              <Package className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-success">{activeCount}</p>
              <p className="text-xs text-muted-foreground">เปิดใช้งาน</p>
            </div>
          </Card>
          <Card className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-muted">
              <Package className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold text-muted-foreground">{inactiveCount}</p>
              <p className="text-xs text-muted-foreground">ปิดใช้งาน</p>
            </div>
          </Card>
        </div>

        {/* Table */}
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
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="สถานะ" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="active">เปิดใช้งาน</SelectItem>
                <SelectItem value="inactive">ปิดใช้งาน</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่ม Add-on
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รหัส</TableHead>
                <TableHead>ชื่อ Add-on</TableHead>
                <TableHead>หมวดหมู่</TableHead>
                <TableHead className="text-right">ราคาเริ่มต้น (บาท)</TableHead>
                <TableHead className="text-center">สถานะการใช้งาน</TableHead>
                <TableHead className="text-center">สถานะ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => (
                <TableRow key={addon.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{addon.id}</TableCell>
                  <TableCell className="font-semibold">{addon.name}</TableCell>
                  <TableCell><Badge variant="outline">{addon.category}</Badge></TableCell>
                  <TableCell className="text-right">{addon.defaultPrice.toLocaleString()}</TableCell>
                  <TableCell className="text-center">{getStockStatusBadge(addon.stockStatus)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={addon.isActive ? "default" : "secondary"}>
                      {addon.isActive ? "เปิดใช้งาน" : "ปิดใช้งาน"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" onClick={() => handleEdit(addon)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingAddon(addon); setDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
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
              <Label>ราคาเริ่มต้น (บาท)</Label>
              <Input type="number" value={formData.defaultPrice} onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })} />
            </div>
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

export default AddonManagementPage;
