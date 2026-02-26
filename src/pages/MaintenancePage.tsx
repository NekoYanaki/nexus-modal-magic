import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Car,
  Search,
  Wrench,
  CheckCircle,
  Calendar,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  Home,
  MessageSquare,
  Users,
  CalendarDays,
  Tent,
  CreditCard,
  Tag,
  Star,
  FileText,
  Database,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { VehicleMaintenanceModal } from "@/components/modals/VehicleMaintenanceModal";
import { Link } from "react-router-dom";

interface MaintenanceVehicle {
  id: string;
  name: string;
  year: string;
  licensePlate: string;
  type: string;
  techInfo: string;
  pricePerDay: number;
  status: "available" | "booked" | "maintenance";
  seats: number;
  doors: number;
  currentMileage: number;
  maintenanceStatus: "pending" | "in_progress" | "completed";
  maintenanceType: string;
  mechanic: string;
  startDate: string;
  estimatedEnd: string;
  issue: string;
}

const mockMaintenanceVehicles: MaintenanceVehicle[] = [
  {
    id: "1",
    name: "Toyota Champ",
    year: "2024",
    licensePlate: "กท 5678",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | อัตโนมัติ",
    pricePerDay: 5000,
    status: "maintenance",
    seats: 4,
    doors: 4,
    currentMileage: 125430,
    maintenanceStatus: "in_progress",
    maintenanceType: "ซ่อมเครื่องยนต์",
    mechanic: "ช่างสมชาย",
    startDate: "20 ก.พ. 2026",
    estimatedEnd: "28 ก.พ. 2026",
    issue: "เครื่องยนต์สั่นผิดปกติ ต้องเปลี่ยนหัวเทียน",
  },
  {
    id: "2",
    name: "Toyota Hilux Revo",
    year: "2023",
    licensePlate: "กม 1234",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "maintenance",
    seats: 4,
    doors: 3,
    currentMileage: 89500,
    maintenanceStatus: "pending",
    maintenanceType: "บำรุงรักษาตามระยะ",
    mechanic: "ยังไม่ระบุ",
    startDate: "26 ก.พ. 2026",
    estimatedEnd: "27 ก.พ. 2026",
    issue: "ครบกำหนดเปลี่ยนน้ำมันเครื่อง 90,000 กม.",
  },
  {
    id: "3",
    name: "All-New TRITON",
    year: "2023",
    licensePlate: "ขก 9012",
    type: "Caravan",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "maintenance",
    seats: 4,
    doors: 4,
    currentMileage: 45200,
    maintenanceStatus: "pending",
    maintenanceType: "ซ่อมช่วงล่าง",
    mechanic: "ช่างวิชัย",
    startDate: "18 ก.พ. 2026",
    estimatedEnd: "1 มี.ค. 2026",
    issue: "ลูกหมากปีกนกหลวม",
  },
  {
    id: "4",
    name: "MERCEDES-BENZ",
    year: "2024",
    licensePlate: "ฉฉ 4567",
    type: "Caravan",
    techInfo: "เบนซิน | อัตโนมัติ",
    pricePerDay: 12000,
    status: "maintenance",
    seats: 4,
    doors: 4,
    currentMileage: 15800,
    maintenanceStatus: "completed",
    maintenanceType: "เปลี่ยนยาง",
    mechanic: "ช่างสมชาย",
    startDate: "15 ก.พ. 2026",
    estimatedEnd: "16 ก.พ. 2026",
    issue: "เปลี่ยนยางทั้ง 4 เส้น ตามระยะ",
  },
  {
    id: "5",
    name: "Ford Ranger",
    year: "2023",
    licensePlate: "นน 7890",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 4500,
    status: "maintenance",
    seats: 4,
    doors: 4,
    currentMileage: 67800,
    maintenanceStatus: "in_progress",
    maintenanceType: "ซ่อมระบบไฟฟ้า",
    mechanic: "ช่างวิชัย",
    startDate: "22 ก.พ. 2026",
    estimatedEnd: "2 มี.ค. 2026",
    issue: "ระบบไฟส่องสว่างหน้าไม่ทำงาน",
  },
];

const MaintenancePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceStatusFilter, setMaintenanceStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<MaintenanceVehicle | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredVehicles = mockMaintenanceVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.issue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = maintenanceStatusFilter === "all" || vehicle.maintenanceStatus === maintenanceStatusFilter;
    const matchesType = typeFilter === "all" || vehicle.maintenanceType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (vehicle: MaintenanceVehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const getMaintenanceStatusBadge = (status: MaintenanceVehicle["maintenanceStatus"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20">รอซ่อม</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/10 text-primary border-primary/20">กำลังซ่อม</Badge>;
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20">เสร็จสิ้น</Badge>;
    }
  };

  // Stats
  const totalMaintenance = mockMaintenanceVehicles.length;
  const pendingCount = mockMaintenanceVehicles.filter((v) => v.maintenanceStatus === "pending").length;
  const inProgressCount = mockMaintenanceVehicles.filter((v) => v.maintenanceStatus === "in_progress").length;
  
  const completedCount = mockMaintenanceVehicles.filter((v) => v.maintenanceStatus === "completed").length;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "แชทลูกค้า", href: "/" },
    { icon: Car, label: "รถทั้งหมด", href: "/" },
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
    { icon: Wrench, label: "ซ่อมบำรุง", href: "/maintenance", active: true },
    { icon: Settings, label: "Stock / Add-on", href: "/stock" },
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
            <h1 className="text-2xl font-bold">ซ่อมบำรุง</h1>
            <p className="text-muted-foreground">ติดตามสถานะการซ่อมบำรุงรถทั้งหมดในระบบ</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">admin</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ทั้งหมด</p>
              <p className="text-2xl font-bold">{totalMaintenance}</p>
            </div>
            <Wrench className="w-8 h-8 text-muted-foreground/30" />
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">รอซ่อม</p>
              <p className="text-2xl font-bold text-warning">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-warning/30" />
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">กำลังซ่อม</p>
              <p className="text-2xl font-bold text-primary">{inProgressCount}</p>
            </div>
            <Settings className="w-8 h-8 text-primary/30" />
          </Card>
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">เสร็จสิ้น</p>
              <p className="text-2xl font-bold text-success">{completedCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success/30" />
          </Card>
        </div>

        {/* Vehicle Maintenance List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">รายการซ่อมบำรุง</h2>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยชื่อรถ, ทะเบียน หรือปัญหา..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={maintenanceStatusFilter} onValueChange={setMaintenanceStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="pending">รอซ่อม</SelectItem>
                <SelectItem value="in_progress">กำลังซ่อม</SelectItem>
                <SelectItem value="completed">เสร็จสิ้น</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="ทุกประเภทงาน" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภทงาน</SelectItem>
                <SelectItem value="ซ่อมเครื่องยนต์">ซ่อมเครื่องยนต์</SelectItem>
                <SelectItem value="บำรุงรักษาตามระยะ">บำรุงรักษาตามระยะ</SelectItem>
                <SelectItem value="ซ่อมช่วงล่าง">ซ่อมช่วงล่าง</SelectItem>
                <SelectItem value="เปลี่ยนยาง">เปลี่ยนยาง</SelectItem>
                <SelectItem value="ซ่อมระบบไฟฟ้า">ซ่อมระบบไฟฟ้า</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รถ</TableHead>
                <TableHead>ประเภทงาน</TableHead>
                <TableHead>ปัญหา / รายละเอียด</TableHead>
                <TableHead>ช่าง</TableHead>
                <TableHead>วันที่เริ่ม</TableHead>
                <TableHead>กำหนดเสร็จ</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Car className="w-6 h-6 text-muted-foreground/50" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{vehicle.name}</p>
                        <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{vehicle.maintenanceType}</span>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground max-w-[200px] truncate">{vehicle.issue}</p>
                  </TableCell>
                  <TableCell className="text-sm">{vehicle.mechanic}</TableCell>
                  <TableCell className="text-sm">{vehicle.startDate}</TableCell>
                  <TableCell className="text-sm">{vehicle.estimatedEnd}</TableCell>
                  <TableCell>{getMaintenanceStatusBadge(vehicle.maintenanceStatus)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(vehicle)}
                    >
                      รายละเอียด
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>แสดง</span>
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(v) => setItemsPerPage(Number(v))}
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>รายการต่อหน้า</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>
                แสดงผล 1 - {filteredVehicles.length} จาก {filteredVehicles.length} รายการ
              </span>
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="px-2">หน้า 1 จาก 1</span>
                <Button variant="outline" size="icon" className="h-8 w-8" disabled>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Vehicle Maintenance Modal */}
      {selectedVehicle && (
        <VehicleMaintenanceModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  );
};

export default MaintenancePage;
