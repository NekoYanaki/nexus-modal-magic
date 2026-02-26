import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  Edit2,
  Save,
  CheckCircle,
  Wrench,
  AlertTriangle,
  Info,
  MapPin,
  FileText,
  Package,
  Plus,
  Minus,
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

// ── Types ──
interface PartStock {
  id: string;
  name: string;
  total: number;
  available: number;
  reserved: number;
  damaged: number;
  minStock: number;
}

interface MaintenanceItem {
  id: string;
  name: string;
  interval: string;
  lastService: string;
  lastMileage: number;
  nextDue: string;
  nextMileage: number;
  status: "normal" | "warning" | "overdue";
  remainingKm?: number;
  remainingDays?: number;
}

interface MaintenanceTask {
  id: string;
  label: string;
  checked: boolean;
}

interface MaintenanceHistory {
  id: string;
  date: string;
  items: string;
  mileage: number;
  status: "completed" | "pending";
  partsUsed?: string;
}

interface VehicleData {
  id: string;
  name: string;
  year: string;
  licensePlate: string;
  type: string;
  techInfo: string;
  pricePerDay: number;
  status: "available" | "booked" | "maintenance";
  image?: string;
  currentMileage: number;
}

interface VehicleMaintenanceModalProps {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleData;
}

// ── Mock data per vehicle (keyed by vehicle id) ──
const mockPartsStock: Record<string, PartStock[]> = {
  "1": [
    { id: "p1", name: "กรองน้ำมันเครื่อง", total: 10, available: 7, reserved: 2, damaged: 1, minStock: 3 },
    { id: "p2", name: "ผ้าเบรกหน้า (ชุด)", total: 6, available: 4, reserved: 2, damaged: 0, minStock: 2 },
    { id: "p3", name: "แบตเตอรี่ 12V", total: 3, available: 1, reserved: 1, damaged: 1, minStock: 2 },
    { id: "p4", name: "น้ำมันเครื่อง 5W-30 (ลิตร)", total: 20, available: 15, reserved: 5, damaged: 0, minStock: 5 },
    { id: "p5", name: "สายพานราวลิ้น", total: 4, available: 0, reserved: 0, damaged: 0, minStock: 2 },
  ],
  default: [
    { id: "p1", name: "กรองน้ำมันเครื่อง", total: 8, available: 6, reserved: 1, damaged: 1, minStock: 3 },
    { id: "p2", name: "ผ้าเบรกหน้า (ชุด)", total: 4, available: 3, reserved: 1, damaged: 0, minStock: 2 },
    { id: "p3", name: "น้ำมันเครื่อง 5W-30 (ลิตร)", total: 15, available: 12, reserved: 3, damaged: 0, minStock: 5 },
  ],
};

export function VehicleMaintenanceModal({ open, onClose, vehicle }: VehicleMaintenanceModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("parts-maintenance");
  const [isEditing, setIsEditing] = useState(false);
  const [currentMileage, setCurrentMileage] = useState(vehicle.currentMileage);
  const [mileageAfterService, setMileageAfterService] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [hasActiveJob, setHasActiveJob] = useState(false);

  // Parts stock state
  const initialParts = mockPartsStock[vehicle.id] || mockPartsStock["default"];
  const [partsStock, setPartsStock] = useState<PartStock[]>(initialParts);

  // Adjust stock modal state
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [adjustPart, setAdjustPart] = useState<PartStock | null>(null);
  const [adjustAction, setAdjustAction] = useState("add");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustNote, setAdjustNote] = useState("");
  const [adjustSaving, setAdjustSaving] = useState(false);

  // Maintenance schedule
  const [maintenanceItems] = useState<MaintenanceItem[]>([
    {
      id: "1", name: "ถ่ายน้ำมันเครื่อง / เฟืองท้าย", interval: "ทุกๆ 10,000 กม.",
      lastService: "120,000 กม.", lastMileage: 120000, nextDue: "130,000 กม.", nextMileage: 130000,
      status: "normal", remainingKm: 4570,
    },
    {
      id: "2", name: "เปลี่ยนแบตเตอรี่", interval: "ทุกๆ 1 ปี",
      lastService: "15 ม.ค. 2023", lastMileage: 115000, nextDue: "15 ม.ค. 2024", nextMileage: 0,
      status: "overdue", remainingDays: 15,
    },
    {
      id: "3", name: "เปลี่ยนผ้าเบรก", interval: "ทุกๆ 30,000 กม.",
      lastService: "100,000 กม.", lastMileage: 100000, nextDue: "130,000 กม.", nextMileage: 130000,
      status: "warning", remainingKm: 4570,
    },
  ]);

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    { id: "1", label: "เปลี่ยนแบตเตอรี่ (Replace Battery)", checked: false },
    { id: "2", label: "ถ่ายน้ำมันเครื่อง (Oil Change)", checked: false },
  ]);

  const [maintenanceHistory] = useState<MaintenanceHistory[]>([
    { id: "1", date: "15 ม.ค. 2023", items: "เปลี่ยนแบตเตอรี่", mileage: 115000, status: "completed", partsUsed: "แบตเตอรี่ 12V x1" },
    { id: "2", date: "10 ธ.ค. 2022", items: "ถ่ายน้ำมันเครื่อง", mileage: 110000, status: "completed", partsUsed: "น้ำมันเครื่อง 5W-30 x4, กรองน้ำมัน x1" },
    { id: "3", date: "5 ก.ย. 2022", items: "เปลี่ยนผ้าเบรกหน้า", mileage: 100000, status: "completed", partsUsed: "ผ้าเบรกหน้า x1 ชุด" },
  ]);

  // ── Adjust stock helpers ──
  const handleAdjustOpen = (part: PartStock) => {
    setAdjustPart(part);
    setAdjustAction("add");
    setAdjustQty(1);
    setAdjustNote("");
    setAdjustOpen(true);
  };

  const adjustMaxQty = useMemo(() => {
    if (!adjustPart) return 999;
    switch (adjustAction) {
      case "reduce": case "damaged": return adjustPart.available;
      case "return": return adjustPart.damaged;
      default: return 999;
    }
  }, [adjustPart, adjustAction]);

  const adjustValidationMsg = useMemo(() => {
    if (adjustQty < 1) return "จำนวนต้องมากกว่า 0";
    if (adjustQty > adjustMaxQty) {
      if (adjustAction === "reduce" || adjustAction === "damaged") return `ไม่สามารถเกินจำนวนพร้อมใช้ (${adjustMaxQty})`;
      if (adjustAction === "return") return `ไม่สามารถเกินจำนวนชำรุด (${adjustMaxQty})`;
    }
    return "";
  }, [adjustQty, adjustMaxQty, adjustAction]);

  const adjustPreview = useMemo(() => {
    if (!adjustPart) return null;
    let a = adjustPart.available, r = adjustPart.reserved, d = adjustPart.damaged, t = adjustPart.total;
    const q = adjustQty;
    switch (adjustAction) {
      case "add": a += q; t += q; break;
      case "reduce": a -= q; t -= q; break;
      case "damaged": a -= q; d += q; break;
      case "return": d -= q; a += q; break;
    }
    return { total: t, available: a, reserved: r, damaged: d };
  }, [adjustPart, adjustAction, adjustQty]);

  const handleAdjustSave = () => {
    if (!adjustPart || adjustValidationMsg) return;
    setAdjustSaving(true);
    setTimeout(() => {
      setPartsStock(prev => prev.map(p => {
        if (p.id !== adjustPart.id) return p;
        return { ...p, ...adjustPreview! };
      }));
      setAdjustSaving(false);
      setAdjustOpen(false);
      toast({ title: "ปรับสต็อกเรียบร้อยแล้ว", description: `${adjustPart.name} อัปเดตแล้ว` });
    }, 600);
  };

  const getPartStatus = (p: PartStock) => {
    if (p.available === 0) return "out";
    if (p.available <= p.minStock) return "low";
    return "ok";
  };

  // ── Maintenance helpers ──
  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => task.id === taskId ? { ...task, checked: !task.checked } : task));
  };
  const handleStartJob = () => setHasActiveJob(true);
  const handleCompleteJob = () => {
    setHasActiveJob(false);
    setTasks(tasks.map(task => ({ ...task, checked: false })));
    setMileageAfterService("");
    setMechanicNotes("");
  };

  const getStatusBadge = (status: MaintenanceItem["status"]) => {
    switch (status) {
      case "normal": return <Badge className="bg-success/10 text-success border-success/20">ปกติ</Badge>;
      case "warning": return <Badge className="bg-warning/10 text-warning border-warning/20">ใกล้ครบกำหนด</Badge>;
      case "overdue": return <Badge className="bg-destructive/10 text-destructive border-destructive/20">เกินกำหนด</Badge>;
    }
  };

  const getProgressValue = (item: MaintenanceItem) => {
    if (item.remainingKm !== undefined) {
      const total = item.nextMileage - item.lastMileage;
      const used = currentMileage - item.lastMileage;
      return Math.min(100, (used / total) * 100);
    }
    return 80;
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
          <DialogHeader className="p-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Car className="w-5 h-5 text-primary" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                รายละเอียดรถ: {vehicle.name}
              </DialogTitle>
            </div>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6 overflow-x-auto">
              <TabsList className="h-12 bg-transparent gap-2 -mb-px">
                <TabsTrigger value="parts-maintenance" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
                  <Package className="w-4 h-4 mr-1" />
                  อะไหล่และบำรุงรักษา
                </TabsTrigger>
                <TabsTrigger value="job" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
                  งานซ่อม
                </TabsTrigger>
                <TabsTrigger value="defects" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent">
                  ตำหนิ/ความเสียหาย
                </TabsTrigger>
              </TabsList>
            </div>

            {/* ═══ Parts & Maintenance Tab ═══ */}
            <TabsContent value="parts-maintenance" className="p-6 mt-0">
              <div className="space-y-8">

                {/* ── Section 1: Parts Stock ── */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Parts Stock — อะไหล่ที่ใช้กับรถคันนี้
                  </h3>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ชื่ออะไหล่</TableHead>
                          <TableHead className="text-center">คงเหลือ</TableHead>
                          <TableHead className="text-center">จุดสั่งซื้อ</TableHead>
                          <TableHead className="text-center">สถานะ</TableHead>
                          <TableHead className="text-right">จัดการ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {partsStock.map((part) => {
                          const st = getPartStatus(part);
                          return (
                            <TableRow key={part.id}>
                              <TableCell className="font-medium">{part.name}</TableCell>
                              <TableCell className="text-center font-semibold">{part.available} / {part.total}</TableCell>
                              <TableCell className="text-center text-muted-foreground">{part.minStock}</TableCell>
                              <TableCell className="text-center">
                                {st === "ok" && <Badge className="bg-success/10 text-success border-0">พร้อมใช้</Badge>}
                                {st === "low" && <Badge className="bg-warning/10 text-warning border-0">ใกล้หมด</Badge>}
                                {st === "out" && <Badge className="bg-destructive/10 text-destructive border-0">หมด</Badge>}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm" onClick={() => handleAdjustOpen(part)}>
                                  ปรับสต็อก
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

                {/* ── Section 2: Maintenance Schedule ── */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Wrench className="w-5 h-5 text-primary" />
                      Maintenance Schedule — การบำรุงรักษาตามระยะ
                    </h3>
                    <Button variant="ghost" size="sm" className="text-primary" onClick={() => setIsEditing(!isEditing)}>
                      <Edit2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                  </div>

                  {/* Current Mileage */}
                  <Card className="p-4 bg-secondary/30 mb-4">
                    <p className="text-sm text-muted-foreground mb-2">เลขไมล์ปัจจุบัน</p>
                    <div className="flex items-center gap-3">
                      <Input type="number" value={currentMileage} onChange={(e) => setCurrentMileage(Number(e.target.value))} className="text-2xl font-bold text-primary h-14 w-48" disabled={!isEditing} />
                      <span className="text-muted-foreground">กม.</span>
                      {isEditing && <Button size="sm" variant="ghost" className="text-primary"><Save className="w-4 h-4" /></Button>}
                    </div>
                  </Card>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {maintenanceItems.map((item) => (
                      <Card key={item.id} className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {item.status === "overdue" ? <AlertTriangle className="w-4 h-4 text-destructive" /> : <Wrench className="w-4 h-4 text-primary" />}
                            <h4 className="font-semibold">{item.name}</h4>
                          </div>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{item.interval}</p>
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs text-muted-foreground">เปลี่ยนล่าสุดที่:</p>
                            <p className="font-medium">{item.lastService}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">ครบกำหนดครั้งถัดไป:</p>
                            <p className={`font-medium ${item.status === "overdue" ? "text-destructive" : ""}`}>{item.nextDue}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Progress value={getProgressValue(item)} className="h-2" />
                          <p className="text-xs text-right text-muted-foreground">
                            {item.remainingKm !== undefined ? `เหลืออีก ${item.remainingKm.toLocaleString()} กม.` : `เหลืออีก ${item.remainingDays} วัน`}
                          </p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* ── Section 3: Maintenance History ── */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Maintenance History — ประวัติการซ่อมบำรุง
                  </h3>
                  <Card>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>วันที่</TableHead>
                          <TableHead>รายการ</TableHead>
                          <TableHead>อะไหล่ที่ใช้</TableHead>
                          <TableHead>เลขไมล์</TableHead>
                          <TableHead>สถานะ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {maintenanceHistory.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.date}</TableCell>
                            <TableCell>{record.items}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{record.partsUsed || "-"}</TableCell>
                            <TableCell>{record.mileage.toLocaleString()} กม.</TableCell>
                            <TableCell>
                              <Badge className="bg-success/10 text-success border-success/20">
                                {record.status === "completed" ? "เสร็จสิ้น" : "รอดำเนินการ"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                </div>

              </div>
            </TabsContent>

            {/* ═══ Job Tab (unchanged) ═══ */}
            <TabsContent value="job" className="p-6 mt-0">
              <Card className={`p-6 ${hasActiveJob ? "border-success" : "border-dashed"}`}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-warning" />
                    <h3 className="text-lg font-semibold">Maintenance Job Panel</h3>
                  </div>
                  {hasActiveJob && <Badge className="bg-success/10 text-success border-success/20">ACTIVE JOB</Badge>}
                </div>
                {hasActiveJob ? (
                  <div className="max-w-2xl">
                    <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                      <div><p className="text-xs text-muted-foreground">Job Start Time</p><p className="font-medium">20 Jan 2024, 09:30</p></div>
                      <div><p className="text-xs text-muted-foreground">Assigned Mechanic</p><div className="flex items-center gap-2"><div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">S</div><span className="font-medium">Somchai K.</span></div></div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <h5 className="font-medium">Task Checklist</h5>
                      {tasks.map((task) => (
                        <label key={task.id} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/30">
                          <Checkbox checked={task.checked} onCheckedChange={() => toggleTask(task.id)} />
                          <span className={task.checked ? "line-through text-muted-foreground" : ""}>{task.label}</span>
                        </label>
                      ))}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-muted-foreground">Mileage After Service</label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input placeholder="e.g. 125440" value={mileageAfterService} onChange={(e) => setMileageAfterService(e.target.value)} className="max-w-xs" />
                          <span className="text-muted-foreground">km</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Mechanic Notes</label>
                        <Textarea placeholder="Any issues found or recommendations..." value={mechanicNotes} onChange={(e) => setMechanicNotes(e.target.value)} className="mt-1 max-w-xl" rows={3} />
                      </div>
                      <Button className="bg-success hover:bg-success/90" onClick={handleCompleteJob}>
                        <CheckCircle className="w-4 h-4 mr-2" /> Complete Maintenance & Release Vehicle
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wrench className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">ไม่มีงานซ่อมบำรุงที่กำลังดำเนินการ</p>
                    <Button onClick={handleStartJob}><Wrench className="w-4 h-4 mr-2" /> เริ่มงานซ่อมบำรุง</Button>
                  </div>
                )}
              </Card>
            </TabsContent>

          </Tabs>
        </DialogContent>
      </Dialog>

      {/* ═══ Adjust Stock Modal ═══ */}
      <Dialog open={adjustOpen} onOpenChange={setAdjustOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>ปรับสต็อก: {adjustPart?.name}</DialogTitle>
          </DialogHeader>

          {adjustPart && (
            <div className="space-y-4">
              {/* Current summary */}
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-secondary/50 rounded-lg"><p className="text-xs text-muted-foreground">ทั้งหมด</p><p className="text-lg font-bold">{adjustPart.total}</p></div>
                <div className="p-2 bg-success/10 rounded-lg"><p className="text-xs text-success">พร้อมใช้</p><p className="text-lg font-bold text-success">{adjustPart.available}</p></div>
                <div className="p-2 bg-warning/10 rounded-lg"><p className="text-xs text-warning">จองแล้ว</p><p className="text-lg font-bold text-warning">{adjustPart.reserved}</p></div>
                <div className="p-2 bg-destructive/10 rounded-lg"><p className="text-xs text-destructive">ชำรุด</p><p className="text-lg font-bold text-destructive">{adjustPart.damaged}</p></div>
              </div>

              {/* Action */}
              <div>
                <label className="text-sm font-medium mb-1 block">ประเภทการปรับ</label>
                <Select value={adjustAction} onValueChange={(v) => { setAdjustAction(v); setAdjustQty(1); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">เพิ่มสต็อก</SelectItem>
                    <SelectItem value="reduce">ลดสต็อก</SelectItem>
                    <SelectItem value="damaged">แจ้งชำรุด</SelectItem>
                    <SelectItem value="return">คืนจากซ่อม</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium mb-1 block">จำนวน</label>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(Math.max(1, adjustQty - 1))}><Minus className="w-4 h-4" /></Button>
                  <Input type="number" min={1} max={adjustMaxQty < 999 ? adjustMaxQty : undefined} value={adjustQty} onChange={(e) => setAdjustQty(Math.max(0, Number(e.target.value)))} className="w-20 text-center" />
                  <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setAdjustQty(adjustQty + 1)}><Plus className="w-4 h-4" /></Button>
                </div>
                {adjustValidationMsg && <p className="text-sm text-destructive mt-1">{adjustValidationMsg}</p>}
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-medium mb-1 block">หมายเหตุ (optional)</label>
                <Textarea value={adjustNote} onChange={(e) => setAdjustNote(e.target.value)} placeholder="บันทึกเหตุผล..." rows={2} />
              </div>

              {/* Preview */}
              {adjustPreview && !adjustValidationMsg && (
                <Card className="p-3 bg-secondary/30">
                  <p className="text-xs font-medium text-muted-foreground mb-2">หลังปรับสต็อก:</p>
                  <div className="grid grid-cols-2 gap-1 text-sm">
                    <span>พร้อมใช้: {adjustPart.available} → <span className="font-semibold text-success">{adjustPreview.available}</span></span>
                    <span>ชำรุด: {adjustPart.damaged} → <span className="font-semibold text-destructive">{adjustPreview.damaged}</span></span>
                    <span>ทั้งหมด: {adjustPart.total} → <span className="font-semibold">{adjustPreview.total}</span></span>
                  </div>
                </Card>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setAdjustOpen(false)}>ยกเลิก</Button>
                <Button onClick={handleAdjustSave} disabled={!!adjustValidationMsg || adjustSaving}>
                  {adjustSaving ? "กำลังบันทึก..." : "บันทึก"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
