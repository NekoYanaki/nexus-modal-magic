import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Car, Plus, Pencil, Trash2, Package, Settings, Bell, Home,
  MessageSquare, Users, CalendarDays, Tent, Calendar, CreditCard, Tag,
  Star, FileText, Database, Boxes, Wrench, ChevronLeft, ChevronRight, Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAddons, type AddonType, type AddonKind } from "@/contexts/AddonContext";

const ITEMS_PER_PAGE = 5;

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

const AddonManagementPage = () => {
  const { addonTypes, setAddonTypes } = useAddons();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingType, setEditingType] = useState<AddonType | null>(null);
  const [formData, setFormData] = useState({ id: "", name: "", price: 0, kind: "equipment" as AddonKind });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingType, setDeletingType] = useState<AddonType | null>(null);
  const [equipPage, setEquipPage] = useState(1);
  const [consumPage, setConsumPage] = useState(1);
  const { toast } = useToast();

  const equipmentTypes = useMemo(() => addonTypes.filter((t) => t.kind === "equipment"), [addonTypes]);
  const consumableTypes = useMemo(() => addonTypes.filter((t) => t.kind === "consumable"), [addonTypes]);

  const equipTotalPages = Math.ceil(equipmentTypes.length / ITEMS_PER_PAGE);
  const consumTotalPages = Math.ceil(consumableTypes.length / ITEMS_PER_PAGE);

  const pagedEquipment = equipmentTypes.slice((equipPage - 1) * ITEMS_PER_PAGE, equipPage * ITEMS_PER_PAGE);
  const pagedConsumable = consumableTypes.slice((consumPage - 1) * ITEMS_PER_PAGE, consumPage * ITEMS_PER_PAGE);

  const handleAdd = (kind: AddonKind = "equipment") => {
    setEditingType(null);
    setFormData({ id: "", name: "", price: 0, kind });
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
      toast({ title: "สำเร็จ", description: "แก้ไขเรียบร้อยแล้ว" });
    } else {
      if (addonTypes.some((t) => t.id === formData.id)) { toast({ title: "ID นี้มีอยู่แล้ว", variant: "destructive" }); return; }
      setAddonTypes((prev) => [...prev, { ...formData }]);
      toast({ title: "สำเร็จ", description: "เพิ่มเรียบร้อยแล้ว" });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (deletingType) {
      setAddonTypes((prev) => prev.filter((t) => t.id !== deletingType.id));
      toast({ title: "สำเร็จ", description: "ลบเรียบร้อยแล้ว" });
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

  const renderTable = (items: AddonType[], emptyText: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-32">ID</TableHead>
          <TableHead>ชื่อ</TableHead>
          <TableHead className="text-right w-40">ราคา</TableHead>
          <TableHead className="text-center w-28">จัดการ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="font-semibold">{t.id}</TableCell>
            <TableCell>{t.name}</TableCell>
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
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">{emptyText}</TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );

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

        <div className="px-6 pt-6 pb-6 flex-1 space-y-6 overflow-auto">
          {/* Equipment Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">อุปกรณ์เสริม (Add-on)</h2>
                <Badge variant="outline" className="ml-1">{equipmentTypes.length} รายการ</Badge>
              </div>
              <Button onClick={() => handleAdd("equipment")} className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มอุปกรณ์
              </Button>
            </div>
            <Card>
              {renderTable(pagedEquipment, "ไม่พบรายการอุปกรณ์")}
              <Pagination currentPage={equipPage} totalPages={equipTotalPages} onPageChange={setEquipPage} />
            </Card>
          </div>

          {/* Consumable Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-xl font-bold">วัสดุสิ้นเปลือง</h2>
                <Badge variant="secondary" className="ml-1">{consumableTypes.length} รายการ</Badge>
              </div>
              <Button onClick={() => handleAdd("consumable")} variant="outline" className="gap-2">
                <Plus className="w-4 h-4" />
                เพิ่มวัสดุสิ้นเปลือง
              </Button>
            </div>
            <Card>
              {renderTable(pagedConsumable, "ไม่พบรายการวัสดุสิ้นเปลือง")}
              <Pagination currentPage={consumPage} totalPages={consumTotalPages} onPageChange={setConsumPage} />
            </Card>
          </div>
        </div>
      </main>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingType ? "แก้ไข" : "เพิ่มรายการ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>ID</Label>
              <Input value={formData.id} onChange={(e) => setFormData({ ...formData, id: e.target.value })} placeholder="เช่น AD0015" disabled={!!editingType} />
              {editingType && <p className="text-xs text-muted-foreground">ไม่สามารถแก้ไข ID ได้</p>}
            </div>
            <div className="space-y-2">
              <Label>ชื่อ</Label>
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
