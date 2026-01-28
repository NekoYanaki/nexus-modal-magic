import { useState } from "react";
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
  Car, 
  Edit2, 
  Save, 
  CheckCircle, 
  Wrench,
  AlertTriangle,
  Info,
  MapPin,
  FileText,
  Camera
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

export function VehicleMaintenanceModal({ open, onClose, vehicle }: VehicleMaintenanceModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [isEditing, setIsEditing] = useState(false);
  const [currentMileage, setCurrentMileage] = useState(vehicle.currentMileage);
  const [mileageAfterService, setMileageAfterService] = useState("");
  const [mechanicNotes, setMechanicNotes] = useState("");
  const [hasActiveJob, setHasActiveJob] = useState(false);

  // Mock maintenance items
  const [maintenanceItems] = useState<MaintenanceItem[]>([
    {
      id: "1",
      name: "ถ่ายน้ำมันเครื่อง / เฟืองท้าย",
      interval: "ทุกๆ 10,000 กม.",
      lastService: "120,000 กม.",
      lastMileage: 120000,
      nextDue: "130,000 กม.",
      nextMileage: 130000,
      status: "normal",
      remainingKm: 4570,
    },
    {
      id: "2",
      name: "เปลี่ยนแบตเตอรี่",
      interval: "ทุกๆ 1 ปี",
      lastService: "15 ม.ค. 2023",
      lastMileage: 115000,
      nextDue: "15 ม.ค. 2024",
      nextMileage: 0,
      status: "overdue",
      remainingDays: 15,
    },
  ]);

  const [tasks, setTasks] = useState<MaintenanceTask[]>([
    { id: "1", label: "เปลี่ยนแบตเตอรี่ (Replace Battery)", checked: false },
    { id: "2", label: "ถ่ายน้ำมันเครื่อง (Oil Change)", checked: false },
  ]);

  const [maintenanceHistory] = useState<MaintenanceHistory[]>([
    { id: "1", date: "15 ม.ค. 2023", items: "เปลี่ยนแบตเตอรี่", mileage: 115000, status: "completed" },
    { id: "2", date: "10 ธ.ค. 2022", items: "ถ่ายน้ำมันเครื่อง", mileage: 110000, status: "completed" },
  ]);

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, checked: !task.checked } : task
    ));
  };

  const handleStartJob = () => {
    setHasActiveJob(true);
  };

  const handleCompleteJob = () => {
    setHasActiveJob(false);
    // Reset tasks
    setTasks(tasks.map(task => ({ ...task, checked: false })));
    setMileageAfterService("");
    setMechanicNotes("");
  };

  const getStatusBadge = (status: MaintenanceItem["status"]) => {
    switch (status) {
      case "normal":
        return <Badge className="bg-success/10 text-success border-success/20">ปกติ</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">ใกล้ครบกำหนด</Badge>;
      case "overdue":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">ใกล้ครบกำหนด</Badge>;
    }
  };

  const getProgressColor = (status: MaintenanceItem["status"]) => {
    switch (status) {
      case "normal":
        return "bg-primary";
      case "warning":
        return "bg-warning";
      case "overdue":
        return "bg-destructive";
    }
  };

  const getProgressValue = (item: MaintenanceItem) => {
    if (item.remainingKm !== undefined) {
      const total = item.nextMileage - item.lastMileage;
      const used = currentMileage - item.lastMileage;
      return Math.min(100, (used / total) * 100);
    }
    return 80; // Default for time-based
  };

  return (
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

        {/* Tabs Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b px-6">
            <TabsList className="h-12 bg-transparent gap-2 -mb-px">
              <TabsTrigger 
                value="basic" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                ข้อมูลพื้นฐาน
              </TabsTrigger>
              <TabsTrigger 
                value="technical" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                ข้อมูลเทคนิค
              </TabsTrigger>
              <TabsTrigger 
                value="maintenance" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                บำรุงรักษา
              </TabsTrigger>
              <TabsTrigger 
                value="job" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                งานซ่อม
              </TabsTrigger>
              <TabsTrigger 
                value="defects" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                ตำหนิ/ความเสียหาย
              </TabsTrigger>
              <TabsTrigger 
                value="availability" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                ความพร้อมใช้
              </TabsTrigger>
              <TabsTrigger 
                value="gps" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                ตำแหน่ง GPS
              </TabsTrigger>
              <TabsTrigger 
                value="notes" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent"
              >
                โน้ต/เอกสาร
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Maintenance Tab Content */}
          <TabsContent value="maintenance" className="p-6 mt-0">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">การบำรุงรักษาตามระยะทาง / เวลา</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-primary"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </div>

              {/* Current Mileage */}
              <Card className="p-4 bg-secondary/30">
                <p className="text-sm text-muted-foreground mb-2">เลขไมล์ปัจจุบัน (แก้ไขได้)</p>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    value={currentMileage}
                    onChange={(e) => setCurrentMileage(Number(e.target.value))}
                    className="text-2xl font-bold text-primary h-14 w-48"
                    disabled={!isEditing}
                  />
                  <span className="text-muted-foreground">กม.</span>
                  {isEditing && (
                    <Button size="sm" variant="ghost" className="text-primary">
                      <Save className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </Card>

              {/* Maintenance Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {maintenanceItems.map((item) => (
                  <Card key={item.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {item.status === "overdue" ? (
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        ) : (
                          <Wrench className="w-4 h-4 text-primary" />
                        )}
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
                        <p className={`font-medium ${item.status === "overdue" ? "text-destructive" : ""}`}>
                          {item.nextDue}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Progress 
                        value={getProgressValue(item)} 
                        className={`h-2 ${getProgressColor(item.status)}`}
                      />
                      <p className="text-xs text-right text-muted-foreground">
                        {item.remainingKm !== undefined 
                          ? `เหลืออีก ${item.remainingKm.toLocaleString()} กม.`
                          : `เหลืออีก ${item.remainingDays} วัน`
                        }
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              <Button className="w-full" disabled={!isEditing}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>

              {/* Maintenance History Table */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">ประวัติการซ่อมบำรุง</h3>
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>วันที่</TableHead>
                        <TableHead>รายการ</TableHead>
                        <TableHead>เลขไมล์</TableHead>
                        <TableHead>สถานะ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {maintenanceHistory.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>{record.items}</TableCell>
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

          {/* Maintenance Job Panel Tab */}
          <TabsContent value="job" className="p-6 mt-0">
            <Card className={`p-6 ${hasActiveJob ? "border-success" : "border-dashed"}`}>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-warning" />
                  <h3 className="text-lg font-semibold">Maintenance Job Panel</h3>
                </div>
                {hasActiveJob && (
                  <Badge className="bg-success/10 text-success border-success/20">ACTIVE JOB</Badge>
                )}
              </div>

              {hasActiveJob ? (
                <div className="max-w-2xl">
                  <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                    <div>
                      <p className="text-xs text-muted-foreground">Job Start Time</p>
                      <p className="font-medium">20 Jan 2024, 09:30</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Assigned Mechanic</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center text-xs font-medium">
                          S
                        </div>
                        <span className="font-medium">Somchai K.</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <h5 className="font-medium">Task Checklist</h5>
                    {tasks.map((task) => (
                      <label
                        key={task.id}
                        className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-secondary/30"
                      >
                        <Checkbox 
                          checked={task.checked} 
                          onCheckedChange={() => toggleTask(task.id)}
                        />
                        <span className={task.checked ? "line-through text-muted-foreground" : ""}>
                          {task.label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground">Mileage After Service</label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          placeholder="e.g. 125440"
                          value={mileageAfterService}
                          onChange={(e) => setMileageAfterService(e.target.value)}
                          className="max-w-xs"
                        />
                        <span className="text-muted-foreground">km</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm text-muted-foreground">Mechanic Notes</label>
                      <Textarea
                        placeholder="Any issues found or recommendations..."
                        value={mechanicNotes}
                        onChange={(e) => setMechanicNotes(e.target.value)}
                        className="mt-1 max-w-xl"
                        rows={3}
                      />
                    </div>

                    <Button 
                      className="bg-success hover:bg-success/90"
                      onClick={handleCompleteJob}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete Maintenance & Release Vehicle
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Wrench className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">ไม่มีงานซ่อมบำรุงที่กำลังดำเนินการ</p>
                  <Button onClick={handleStartJob}>
                    <Wrench className="w-4 h-4 mr-2" />
                    เริ่มงานซ่อมบำรุง
                  </Button>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ข้อมูลพื้นฐาน</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ชื่อรถ</p>
                  <p className="font-medium">{vehicle.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ปี</p>
                  <p className="font-medium">{vehicle.year}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ทะเบียน</p>
                  <p className="font-medium">{vehicle.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ประเภท</p>
                  <p className="font-medium">{vehicle.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ราคา/วัน</p>
                  <p className="font-medium text-success">฿{vehicle.pricePerDay.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">สถานะ</p>
                  <Badge className={
                    vehicle.status === "available" 
                      ? "bg-success/10 text-success" 
                      : vehicle.status === "booked"
                      ? "bg-primary/10 text-primary"
                      : "bg-warning/10 text-warning"
                  }>
                    {vehicle.status === "available" ? "ว่าง" : vehicle.status === "booked" ? "ถูกจอง" : "ซ่อมบำรุง"}
                  </Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Technical Tab */}
          <TabsContent value="technical" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ข้อมูลเทคนิค</h3>
              <p className="text-muted-foreground">{vehicle.techInfo}</p>
            </Card>
          </TabsContent>

          {/* Defects Tab */}
          <TabsContent value="defects" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ตำหนิ/ความเสียหาย</h3>
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ไม่มีรายการตำหนิหรือความเสียหาย</p>
              </div>
            </Card>
          </TabsContent>

          {/* Availability Tab */}
          <TabsContent value="availability" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ความพร้อมใช้</h3>
              <div className="text-center py-8 text-muted-foreground">
                <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ปฏิทินความพร้อมใช้งาน</p>
              </div>
            </Card>
          </TabsContent>

          {/* GPS Tab */}
          <TabsContent value="gps" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">ตำแหน่ง GPS</h3>
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ไม่มีข้อมูลตำแหน่ง GPS</p>
              </div>
            </Card>
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="p-6 mt-0">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">โน้ต/เอกสาร</h3>
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>ไม่มีโน้ตหรือเอกสาร</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
