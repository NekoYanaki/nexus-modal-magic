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
  Car, Plus, Pencil, Trash2, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddons, type AddonType, type AddonKind } from "@/contexts/AddonContext";

const kindLabel = (k: AddonKind) => k === "consumable" ? "วัสดุสิ้นเปลือง" : "อุปกรณ์";

const AddonManagementPage = () => {
  const { addonTypes, setAddonTypes } = useAddons();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AddonType | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", price: 0, kind: "equipment" as AddonKind });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingType, setDeletingType] = useState<AddonType | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setEditingType(null);
    setFormData({ id: "", name: "", price: 0, kind: "equipment" });
    setDialogOpen(true);
  };

  const handleEdit = (t: AddonType) => {
    setEditingType(t);
    setFormData({ id: t.id, name: t.name, price: t.price, kind: t.kind });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.id.trim()) { toast({ title: "กรุณากรอก ID", variant: "destructive" }); return; }
    if (!formData.name.trim()) { toast({ title: "กรุณากรอกชื่อ", variant: "destructive" }); return; }
    if (editingType) {
      setAddonTypes((prev) => prev.map((t) => t.id === editingType.id ? { ...formData } : t));
      toast({ title: "สำเร็จ", description: "แก้ไข Add-on เรียบร้อยแล้ว" });
    } else {
      if (addonTypes.some((t) => t.id === formData.id)) { toast({ title: "ID นี้มีอยู่แล้ว", variant: "destructive" }); return; }
      setAddonTypes((prev) => [...prev, { ...formData }]);
      toast({ title: "สำเร็จ", description: "เพิ่ม Add-on เรียบร้อยแล้ว" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingType) {
      setAddonTypes((prev) => prev.filter((t) => t.id !== deletingType.id));
      toast({ title: "สำเร็จ", description: "ลบ Add-on เรียบร้อยแล้ว" });
    }
    setDeleteDialogOpen(false);
    setDeletingType(null);
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

      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-end gap-3 px-6 py-3 border-b">
          <div className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute -top-1.5 -right-1.5 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">04</span>
          </div>
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-sm">admin</span>
        </div>

        {/* Page header */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">จัดการ Add-on</h1>
              <p className="text-sm text-muted-foreground">จัดการรายการอุปกรณ์เสริม (Add-on)</p>
            </div>
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="w-4 h-4" />
              เพิ่ม Add-on
            </Button>
          </div>
        </div>

        <div className="px-6 pb-6 flex-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">ID</TableHead>
                <TableHead>ชื่อ</TableHead>
                <TableHead className="w-32">ประเภท</TableHead>
                <TableHead className="text-right w-40">ราคา</TableHead>
                <TableHead className="text-center w-28">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {addonTypes.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-semibold">{t.id}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>
                    <Badge variant={t.kind === "consumable" ? "secondary" : "outline"} className="text-xs">
                      {kindLabel(t.kind)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{t.price.toLocaleString()} บาท</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-warning" onClick={() => handleEdit(t)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => { setDeletingType(t); setDeleteDialogOpen(true); }}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {addonTypes.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">ไม่พบข้อมูล</TableCell>
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
            <DialogTitle>{editingType ? "แก้ไข Add-on" : "เพิ่ม Add-on"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="เช่น AD0008" disabled={!!editingType} />
              {editingType && <p className="text-xs text-muted-foreground">ไม่สามารถแก้ไข ID ได้</p>}
            </div>
            <div className="space-y-2">
              <Label>ชื่อ Add-on</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="เช่น เบาะนั่งเด็ก" />
            </div>
            <div className="space-y-2">
              <Label>ประเภท</Label>
              <Select value={formData.kind} onValueChange={(v) => setFormData({ ...formData, kind: v as AddonKind })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="equipment">อุปกรณ์</SelectItem>
                  <SelectItem value="consumable">วัสดุสิ้นเปลือง</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>ราคา (บาท)</Label>
              <Input type="number" min={0} value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} placeholder="เช่น 300" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSave}>{editingType ? "บันทึก" : "เพิ่ม"}</Button>
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
            คุณต้องการลบ <span className="font-semibold text-foreground">{deletingType?.name}</span> ออกจากระบบหรือไม่?
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
