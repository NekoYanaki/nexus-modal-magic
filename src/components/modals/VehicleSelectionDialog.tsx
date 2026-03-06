import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { Car, Search, Check } from "lucide-react";

export interface SelectableVehicle {
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
  image?: string;
}

const VEHICLE_TYPES = [
  "Motorhome A Class",
  "Motorhome C Class",
  "Caravan",
  "Campervan",
  "Pickup Camper",
];

// Mock available vehicles
const MOCK_FLEET: SelectableVehicle[] = [
  {
    id: "v1",
    name: "Toyota Champ",
    year: "2024",
    licensePlate: "-",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | อัตโนมัติ",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 4,
  },
  {
    id: "v2",
    name: "Toyota Hilux Revo",
    year: "2023",
    licensePlate: "กม 1234",
    type: "Motorhome A Class",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 3,
  },
  {
    id: "v3",
    name: "All-New TRITON",
    year: "2023",
    licensePlate: "-",
    type: "Caravan",
    techInfo: "ดีเซล | 4WD",
    pricePerDay: 5000,
    status: "available",
    seats: 4,
    doors: 4,
  },
  {
    id: "v4",
    name: "MERCEDES-BENZ",
    year: "2024",
    licensePlate: "-",
    type: "Caravan",
    techInfo: "เบนซิน | อัตโนมัติ",
    pricePerDay: 12000,
    status: "available",
    seats: 4,
    doors: 4,
  },
  {
    id: "v5",
    name: "Ford Transit",
    year: "2024",
    licensePlate: "กข 5678",
    type: "Campervan",
    techInfo: "ดีเซล | อัตโนมัติ",
    pricePerDay: 4500,
    status: "booked",
    seats: 4,
    doors: 3,
  },
  {
    id: "v6",
    name: "Hyundai H-1",
    year: "2023",
    licensePlate: "กค 9012",
    type: "Motorhome C Class",
    techInfo: "ดีเซล | อัตโนมัติ",
    pricePerDay: 6000,
    status: "maintenance",
    seats: 6,
    doors: 4,
  },
];

interface VehicleSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (vehicle: SelectableVehicle) => void;
  currentVehicleId?: string;
  initialType?: string;
}

export const VehicleSelectionDialog = ({
  open,
  onClose,
  onSelect,
  currentVehicleId,
  initialType = "",
}: VehicleSelectionDialogProps) => {
  const [selectedType, setSelectedType] = useState(initialType);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      setSelectedType(initialType);
      setSearchQuery("");
    }
  }, [open, initialType]);

  const filteredVehicles = MOCK_FLEET.filter((v) => {
    const matchesType = selectedType ? v.type === selectedType : true;
    const matchesSearch =
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getStatusBadge = (status: SelectableVehicle["status"]) => {
    switch (status) {
      case "available":
        return <Badge className="bg-success text-success-foreground">ว่าง</Badge>;
      case "booked":
        return <Badge className="bg-primary text-primary-foreground">ถูกจอง</Badge>;
      case "maintenance":
        return <Badge className="bg-warning text-warning-foreground">ซ่อมบำรุง</Badge>;
    }
  };

  const handleSelect = (vehicle: SelectableVehicle) => {
    onSelect(vehicle);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[900px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            เลือกรถ
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Select Type */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">ประเภทรถ</p>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกประเภทรถ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">ทุกประเภท</SelectItem>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">ค้นหา</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="ค้นหาชื่อรถ / ทะเบียน..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Step 2: Vehicle Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">รูปรถ</TableHead>
                  <TableHead>ข้อมูลรถ</TableHead>
                  <TableHead>ประเภท</TableHead>
                  <TableHead>ข้อมูลเทคนิค</TableHead>
                  <TableHead>ราคา/วัน</TableHead>
                  <TableHead>สถานะ</TableHead>
                  <TableHead className="w-24">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVehicles.length > 0 ? (
                  filteredVehicles.map((vehicle) => (
                    <TableRow
                      key={vehicle.id}
                      className={
                        vehicle.id === currentVehicleId
                          ? "bg-primary/5 border-primary/20"
                          : ""
                      }
                    >
                      <TableCell>
                        <div className="w-20 h-14 bg-secondary rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-muted-foreground/50" />
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
                        {vehicle.id === currentVehicleId ? (
                          <Badge variant="outline" className="gap-1">
                            <Check className="w-3 h-3" />
                            เลือกอยู่
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelect(vehicle)}
                            disabled={vehicle.status !== "available"}
                          >
                            เลือก
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      ไม่พบรถที่ตรงกับเงื่อนไข
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <p className="text-xs text-muted-foreground">
            แสดง {filteredVehicles.length} รายการ จากทั้งหมด {MOCK_FLEET.length} คัน
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
