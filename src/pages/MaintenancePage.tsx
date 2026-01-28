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
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Car,
  Search,
  Plus,
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
  Wrench,
} from "lucide-react";
import { VehicleMaintenanceModal } from "@/components/modals/VehicleMaintenanceModal";
import { Link } from "react-router-dom";

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
  seats: number;
  doors: number;
  currentMileage: number;
}

const mockVehicles: VehicleData[] = [
  {
    id: "1",
    name: "Toyota Champ",
    year: "2024",
    licensePlate: "-",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | อัตโนมัติ",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 4,
    currentMileage: 125430,
  },
  {
    id: "2",
    name: "Toyota Hilux Revo",
    year: "2023",
    licensePlate: "กม 1234",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 3,
    currentMileage: 89500,
  },
  {
    id: "3",
    name: "All-New TRITON",
    year: "2023",
    licensePlate: "-",
    type: "Caravan",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 4,
    currentMileage: 45200,
  },
  {
    id: "4",
    name: "MERCEDES-BENZ",
    year: "2024",
    licensePlate: "-",
    type: "Caravan",
    techInfo: "เบนซิน | อัตโนมัติ",
    pricePerDay: 12000,
    status: "available",
    seats: 4,
    doors: 4,
    currentMileage: 15800,
  },
];

const MaintenancePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  const filteredVehicles = mockVehicles.filter((vehicle) => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesType = typeFilter === "all" || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleViewDetails = (vehicle: VehicleData) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const getStatusBadge = (status: VehicleData["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">ว่าง</Badge>;
      case "booked":
        return <Badge className="bg-primary text-primary-foreground">ถูกจอง</Badge>;
      case "maintenance":
        return <Badge className="bg-warning text-warning-foreground">ซ่อมบำรุง</Badge>;
    }
  };

  // Stats
  const totalVehicles = mockVehicles.length;
  const availableVehicles = mockVehicles.filter((v) => v.status === "available").length;
  const bookedVehicles = mockVehicles.filter((v) => v.status === "booked").length;
  const maintenanceVehicles = mockVehicles.filter((v) => v.status === "maintenance").length;

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "แชทลูกค้า", href: "/" },
    { icon: Car, label: "รถทั้งหมด", href: "/maintenance", active: true },
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
            <h1 className="text-2xl font-bold">จัดการรถ</h1>
            <p className="text-muted-foreground">จัดการข้อมูลรถทั้งหมดในระบบ</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              เพิ่มรถใหม่
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

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">รถทั้งหมด</p>
              <p className="text-2xl font-bold">{totalVehicles}</p>
            </div>
            <Car className="w-8 h-8 text-muted-foreground/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-success/30">
            <div>
              <p className="text-sm text-muted-foreground">รถว่าง</p>
              <p className="text-2xl font-bold text-success">{availableVehicles}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-success/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-primary/30">
            <div>
              <p className="text-sm text-muted-foreground">รถถูกจอง</p>
              <p className="text-2xl font-bold text-primary">{bookedVehicles}</p>
            </div>
            <Calendar className="w-8 h-8 text-primary/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-warning/30">
            <div>
              <p className="text-sm text-muted-foreground">ซ่อมบำรุง</p>
              <p className="text-2xl font-bold text-warning">{maintenanceVehicles}</p>
            </div>
            <Settings className="w-8 h-8 text-warning/50" />
          </Card>
          <Card className="p-4 flex items-center justify-between border-destructive/30">
            <div>
              <p className="text-sm text-muted-foreground">แจ้งเตือน</p>
              <p className="text-2xl font-bold text-destructive">0</p>
            </div>
            <Bell className="w-8 h-8 text-destructive/50" />
          </Card>
        </div>

        {/* Vehicle List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">รายการรถ</h2>

          {/* Filters */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="ค้นหาด้วยชื่อรถหรือทะเบียน..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ทุกสถานะ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกสถานะ</SelectItem>
                <SelectItem value="available">ว่าง</SelectItem>
                <SelectItem value="booked">ถูกจอง</SelectItem>
                <SelectItem value="maintenance">ซ่อมบำรุง</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="ทุกประเภท" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทุกประเภท</SelectItem>
                <SelectItem value="Motorhome A Class">Motorhome A Class</SelectItem>
                <SelectItem value="Caravan">Caravan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>รูปรถ</TableHead>
                <TableHead>ข้อมูลรถ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ข้อมูลเทคนิค</TableHead>
                <TableHead>ราคา/วัน</TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead>จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="w-24 h-16 bg-secondary rounded-lg flex items-center justify-center">
                      <Car className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{vehicle.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} | {vehicle.licensePlate}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {vehicle.seats} ที่นั่ง | {vehicle.doors} ประตู
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{vehicle.type}</TableCell>
                  <TableCell>{vehicle.techInfo}</TableCell>
                  <TableCell className="text-success font-semibold">
                    ฿{vehicle.pricePerDay.toLocaleString()}
                  </TableCell>
                  <TableCell>{getStatusBadge(vehicle.status)}</TableCell>
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
