import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Car,
  Search,
  Plus,
  Pencil,
  Trash2,
  Package,
  Settings,
  Bell,
  Home,
  MessageSquare,
  Users,
  CalendarDays,
  Tent,
  Calendar,
  CreditCard,
  Tag,
  Star,
  FileText,
  Database,
  Boxes,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Addon {
  id: string;
  name: string;
  defaultPrice: number;
  isActive: boolean;
}

interface StoreStock {
  id: string;
  addonId: string;
  status: string;
  qty: number;
  createDate: string;
}

const mockAddons: Addon[] = [
  { id: "AD0001", name: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true },
  { id: "AD0002", name: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true },
  { id: "AD0003", name: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true },
  { id: "AD0004", name: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true },
  { id: "AD0005", name: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true },
  { id: "AD0006", name: "เก้าอี้พับ (ชุด)", defaultPrice: 300, isActive: true },
  { id: "AD0007", name: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false },
];

const mockStocks: StoreStock[] = [
  { id: "ST001", addonId: "AD0001", status: "available", qty: 5, createDate: "2024-01-15" },
  { id: "ST002", addonId: "AD0002", status: "available", qty: 10, createDate: "2024-01-15" },
  { id: "ST003", addonId: "AD0003", status: "available", qty: 8, createDate: "2024-02-01" },
  { id: "ST004", addonId: "AD0004", status: "available", qty: 2, createDate: "2024-02-01" },
  { id: "ST005", addonId: "AD0005", status: "available", qty: 6, createDate: "2024-03-01" },
  { id: "ST006", addonId: "AD0006", status: "available", qty: 12, createDate: "2024-03-01" },
  { id: "ST007", addonId: "AD0007", status: "unavailable", qty: 0, createDate: "2024-03-10" },
];

const StockPage = () => {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);
  const [stocks] = useState<StoreStock[]>(mockStocks);
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<Addon | null>(null);
  const [formData, setFormData] = useState({ name: "", defaultPrice: 0, isActive: true });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingAddon, setDeletingAddon] = useState<Addon | null>(null);

  const filteredAddons = addons.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStock = (addonId: string) => stocks.find((s) => s.addonId === addonId);

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
      setAddons((prev) =>
        prev.map((a) =>
          a.id === editingAddon.id ? { ...a, ...formData } : a
        )
      );
    } else {
      const newId = `AD${String(addons.length + 1).padStart(4, "0")}`;
      setAddons((prev) => [...prev, { id: newId, ...formData }]);
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingAddon) {
      setAddons((prev) => prev.filter((a) => a.id !== deletingAddon.id));
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
    { icon: Boxes, label: "Stock / Add-on", href: "/stock", active: true },
    { icon: Settings, label: "ตั้งค่า", href: "/" },
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
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10"
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
            <h1 className="text-2xl font-bold">จัดการ Add-on</h1>
            <p className="text-muted-foreground">จัดการรายการอุปกรณ์เสริม (Add-on)</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90" onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              เพิ่ม Add-on
            </Button>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-sm">admin</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Add-on ทั้งหมด</p>
              <p className="text-2xl font-bold">{addons.length}</p>
            </div>
            <Package className="w-8 h-8 text-muted-foreground/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-success/30">
            <div>
              <p className="text-sm text-muted-foreground">ใช้งานอยู่</p>
              <p className="text-2xl font-bold text-success">{addons.filter((a) => a.isActive).length}</p>
            </div>
            <Package className="w-8 h-8 text-success/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-warning/30">
            <div>
              <p className="text-sm text-muted-foreground">ปิดใช้งาน</p>
              <p className="text-2xl font-bold text-warning">{addons.filter((a) => !a.isActive).length}</p>
            </div>
            <Package className="w-8 h-8 text-warning/50" />
          </Card>
        </div>

        {/* Table */}
        <Card className="p-6">
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
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead className="text-center">สต็อก</TableHead>
                <TableHead className="text-center">สถานะ</TableHead>
                <TableHead className="text-right">ราคา</TableHead>
                <TableHead className="text-right w-28">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAddons.map((addon) => {
                const stock = getStock(addon.id);
                return (
                  <TableRow key={addon.id}>
                    <TableCell className="font-semibold">{addon.id}</TableCell>
                    <TableCell>{addon.name}</TableCell>
                    <TableCell className="text-center">
                      {stock ? stock.qty : 0}
                    </TableCell>
                    <TableCell className="text-center">
                      {addon.isActive ? (
                        <Badge className="bg-success text-success-foreground">ใช้งาน</Badge>
                      ) : (
                        <Badge variant="secondary">ปิดใช้งาน</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {addon.defaultPrice.toLocaleString()} บาท
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" onClick={() => handleEdit(addon)}>
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => { setDeletingAddon(addon); setDeleteDialogOpen(true); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filteredAddons.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    ไม่พบข้อมูล Add-on
                  </TableCell>
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
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="เช่น เบาะนั่งเด็ก"
              />
            </div>
            <div className="space-y-2">
              <Label>ราคาเริ่มต้น (บาท)</Label>
              <Input
                type="number"
                value={formData.defaultPrice}
                onChange={(e) => setFormData({ ...formData, defaultPrice: Number(e.target.value) })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>เปิดใช้งาน</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
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
