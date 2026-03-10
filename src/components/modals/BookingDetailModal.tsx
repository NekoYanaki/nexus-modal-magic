import { Car, Tent, RefreshCw, MapPin, Calendar, X, Printer, Plus, Trash2, Package, ChevronsUpDown, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useAddons, type Addon } from "@/contexts/AddonContext";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingDocumentModal } from "./BookingDocumentModal";
import { VehicleSelectionDialog, type SelectableVehicle } from "./VehicleSelectionDialog";
import { VehicleChangeReasonDialog, VehicleChangeFinalConfirmDialog } from "./VehicleChangeConfirmDialog";
import { useState } from "react";
import { toast } from "sonner";

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({ open, onClose }: BookingDetailModalProps) => {
  const [showDocument, setShowDocument] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("confirmed");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [showVehicleSelection, setShowVehicleSelection] = useState(false);
  const [showChangeReason, setShowChangeReason] = useState(false);
  const [showFinalConfirm, setShowFinalConfirm] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const [pendingVehicle, setPendingVehicle] = useState<SelectableVehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<SelectableVehicle | null>(null);
  const [isEditingAddons, setIsEditingAddons] = useState(false);
  const [addonComboboxOpen, setAddonComboboxOpen] = useState(false);
  const [bookingAddons, setBookingAddons] = useState([
    { id: "CS-001", name: "เบาะนั่งเด็ก", price: 300 },
    { id: "BBQ-003", name: "ชุดปิ้งย่าง", price: 350 },
    { id: "AW-012", name: "กันสาด", price: 400 },
    { id: "CH-007", name: "เก้าอี้พับ (ชุด)", price: 150 },
  ]);
  const { addons: stockAddons } = useAddons();

  // Available stock addons (active & available, not already added)
  const availableStockAddons = useMemo(() => {
    return stockAddons.filter(a => a.isActive && a.stockStatus === "available");
  }, [stockAddons]);

  const categoryAvailableCount = useMemo(() => {
    const counts: Record<string, number> = {};
    availableStockAddons.forEach(a => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [availableStockAddons]);

  const handleAddAddon = (stockAddonId: string) => {
    const stockAddon = stockAddons.find(a => a.id === stockAddonId);
    if (!stockAddon) return;
    if (bookingAddons.some(a => a.id === stockAddonId)) {
      toast.error("รายการนี้ถูกเพิ่มแล้ว");
      return;
    }
    setBookingAddons(prev => [...prev, { id: stockAddon.id, name: stockAddon.name, price: stockAddon.defaultPrice }]);
    setAddonComboboxOpen(false);
    toast.success(`เพิ่ม ${stockAddon.name} สำเร็จ`);
  };

  const handleRemoveAddon = (id: string) => {
    setBookingAddons((prev) => prev.filter((a) => a.id !== id));
    toast.success("ลบ Add-on สำเร็จ");
  };

  const addonsTotal = bookingAddons.reduce((sum, a) => sum + a.price, 0);


  const hasCamp = true;

  const mockData = {
    code: "1769138324072",
    vehicleName: "Toyata Hilux Revo",
    status: bookingStatus,
    dateRange: "23–25 Jan 2026",
    customerName: "test",
    customerPhone: "0999999123",
    customerEmail: "test@gmail.com",
    pickupDate: "23–25 Jan 2026",
    totalDays: 3,
    vehicleModel: "Toyata Hilux Revo 2.8L",
    licensePlate: "กบ 1234",
    vehicleType: "Motorhome A Class",
    insurance: "Insurance Class 1",
    rentalFee: 5000,
    deposit: 4000,
    vehicleRental: 5000,
    addonsTotal: addonsTotal,
    totalPaid: 4000,
    totalDue: 3650,
    totalAmount: 7650,
    addons: bookingAddons,
    camps: [
      {
        name: "ป่าสนแคมปิ้ง",
        phone: "099999999",
        date: "23–24 Jan 2026",
        fee: 2500,
        zone: { name: "บ้านพัก", price: 2000, priceType: "เหมาจ่าย" },
      },
      {
        name: "ดอยม่อนแจ่ม แคมป์",
        phone: "081234567",
        date: "24–25 Jan 2026",
        fee: 800,
        zone: { name: "โซน Riverside", price: 800, priceType: "ต่อคืน" },
      },
    ],
  };

  const handleRejectConfirm = () => {
    setBookingStatus("rejected");
    setShowRejectConfirm(false);
    toast.success("ปฏิเสธการจองสำเร็จ");
  };

  const getStatusBadge = () => {
    const map: Record<string, { cls: string; label: string }> = {
      confirmed: { cls: "bg-success/15 text-success border-success/20", label: "ยืนยันแล้ว" },
      picked_up: { cls: "bg-primary/15 text-primary border-primary/20", label: "รับรถแล้ว" },
      returned: { cls: "bg-info/15 text-info border-info/20", label: "คืนรถแล้ว" },
      rejected: { cls: "bg-destructive/15 text-destructive border-destructive/20", label: "ปฏิเสธ" },
    };
    const s = map[bookingStatus] || { cls: "bg-muted text-muted-foreground", label: bookingStatus };
    return <Badge className={`${s.cls} text-xs px-2.5 py-0.5`}>{s.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* ── Header ── */}
        <DialogHeader className="px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold">{mockData.code}</h2>
                {getStatusBadge()}
                <span className="text-sm text-muted-foreground">{mockData.dateRange}</span>
              </div>
              <p className="text-sm font-medium">{mockData.vehicleName}</p>
              <p className="text-xs text-muted-foreground">
                {mockData.customerName} • {mockData.customerPhone}
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowDocument(true)}>
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </DialogHeader>

        {/* ── Section Title ── */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="text-lg font-bold">Information</h3>
        </div>

        {/* ── Body: 2/3 + 1/3 ── */}
        <div className="grid grid-cols-3 gap-5 px-6 pb-6">
          {/* Left Column (2/3) */}
          <div className="col-span-2 space-y-4">

            {/* Booking Information */}
            <Card className="p-5 border border-border">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-primary" />
                Booking Information
              </h4>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Booking ID</p>
                  <p className="font-medium">{mockData.code}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-0.5">Status</p>
                  {getStatusBadge()}
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Customer Info</p>
                  <p className="font-medium">{mockData.customerName}</p>
                  <p className="text-xs text-muted-foreground">{mockData.customerPhone}</p>
                  <p className="text-xs text-muted-foreground">{mockData.customerEmail}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-0.5">Pick Up Date</p>
                  <p className="font-medium">{mockData.pickupDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Total Days</p>
                  <p className="font-medium">{mockData.totalDays} days</p>
                </div>
              </div>
            </Card>

            {/* Vehicle */}
            <Card className="p-5 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Car className="w-4 h-4 text-primary" />
                  Vehicle
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground"
                  onClick={() => setShowChangeReason(true)}
                >
                  <RefreshCw className="w-3 h-3" />
                  เปลี่ยนรถ
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Model</p>
                  <p className="font-medium">{selectedVehicle ? `${selectedVehicle.name} ${selectedVehicle.year}` : mockData.vehicleModel}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-0.5">License Plate</p>
                  <p className="font-medium">{selectedVehicle ? selectedVehicle.licensePlate : mockData.licensePlate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Vehicle Type</p>
                  <p className="font-medium">{selectedVehicle ? selectedVehicle.type : mockData.vehicleType}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-0.5">Insurance</p>
                  <p className="font-medium">{mockData.insurance}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Rental Fee</p>
                  <p className="font-medium">฿{mockData.rentalFee.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Add-ons & Accessories */}
            <Card className="p-5 border border-border">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" />
                  Add-ons & Accessories
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs text-muted-foreground"
                  onClick={() => setIsEditingAddons(!isEditingAddons)}
                >
                  {isEditingAddons ? "เสร็จสิ้น" : "แก้ไข"}
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                {bookingAddons.map((addon, i) => (
                  <div key={addon.id} className="flex items-center justify-between p-2 border border-border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-mono bg-muted/50">{addon.id}</Badge>
                      <span className="text-sm">{addon.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">฿{addon.price.toLocaleString()}</span>
                      {isEditingAddons && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveAddon(addon.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}

                {isEditingAddons && availableAddonTypes.length > 0 && (
                  <div className="flex items-center gap-2 pt-2">
                    <Select value={selectedAddonToAdd} onValueChange={setSelectedAddonToAdd}>
                      <SelectTrigger className="h-8 text-xs flex-1">
                        <SelectValue placeholder="เลือก Add-on ที่ต้องการเพิ่ม" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableAddonTypes.map((t) => (
                          <SelectItem key={t.id} value={t.id} className="text-xs">
                            {t.name} — ฿{t.price.toLocaleString()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" className="h-8 text-xs gap-1" onClick={handleAddAddon} disabled={!selectedAddonToAdd}>
                      <Plus className="w-3.5 h-3.5" />
                      เพิ่ม
                    </Button>
                  </div>
                )}

                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รวม Add-on</span>
                  <span className="font-semibold text-primary">฿{addonsTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {hasCamp && (
              <Card className="p-5 border border-border">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Tent className="w-4 h-4 text-primary" />
                  Campsite
                </h4>
                <div className="space-y-3">
                  {mockData.camps.map((camp, ci) => (
                    <div key={ci}>
                      {ci > 0 && <Separator className="my-3" />}
                      <div className="grid grid-cols-2 gap-y-3 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Camp</p>
                          <p className="font-medium">{camp.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs mb-0.5">Camp Date</p>
                          <p className="font-medium">{camp.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Zone</p>
                          <p className="font-medium">{camp.zone.name}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground text-xs mb-0.5">Fee</p>
                          <Badge variant="outline" className="text-xs bg-primary/5 text-primary border-primary/20">
                            ฿{camp.zone.price.toLocaleString()} ({camp.zone.priceType})
                          </Badge>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-0.5">Camp Tel.</p>
                          <p className="font-medium">{camp.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-4">
            {/* Cost Summary */}
            <Card className="p-5 border border-border">
              <h4 className="font-semibold mb-3">Cost Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-semibold text-success">฿{mockData.totalPaid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-warning">฿{mockData.totalDue.toLocaleString()}</span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">฿{mockData.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </Card>


          </div>
        </div>
      </DialogContent>

      <BookingDocumentModal
        open={showDocument}
        onClose={() => setShowDocument(false)}
        bookingData={mockData}
      />

      <VehicleChangeReasonDialog
        open={showChangeReason}
        onClose={() => setShowChangeReason(false)}
        onConfirm={(reason) => {
          setChangeReason(reason);
          setShowChangeReason(false);
          setShowVehicleSelection(true);
        }}
      />

      <VehicleSelectionDialog
        open={showVehicleSelection}
        onClose={() => setShowVehicleSelection(false)}
        currentVehicleId={selectedVehicle?.id}
        initialType={mockData.vehicleType}
        onSelect={(vehicle) => {
          setPendingVehicle(vehicle);
          setShowVehicleSelection(false);
          setShowFinalConfirm(true);
        }}
      />

      <VehicleChangeFinalConfirmDialog
        open={showFinalConfirm}
        onClose={() => {
          setShowFinalConfirm(false);
          setPendingVehicle(null);
        }}
        onConfirm={() => {
          if (pendingVehicle) {
            setSelectedVehicle(pendingVehicle);
            toast.success(`เปลี่ยนรถเป็น ${pendingVehicle.name} สำเร็จ`);
          }
          setShowFinalConfirm(false);
          setPendingVehicle(null);
          setChangeReason("");
        }}
        selectedVehicle={pendingVehicle}
        originalVehicle={selectedVehicle ? {
          name: selectedVehicle.name,
          year: selectedVehicle.year,
          licensePlate: selectedVehicle.licensePlate,
          type: selectedVehicle.type,
          pricePerDay: selectedVehicle.pricePerDay,
        } : {
          name: mockData.vehicleModel,
          licensePlate: mockData.licensePlate,
          type: mockData.vehicleType,
          pricePerDay: mockData.vehicleRental,
        }}
        reason={changeReason}
      />

      <AlertDialog open={showRejectConfirm} onOpenChange={setShowRejectConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการปฏิเสธ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการปฏิเสธการจอง <strong>{mockData.code}</strong> ใช่หรือไม่?
              <br /><br />
              <span className="text-muted-foreground">ลูกค้า: {mockData.customerName}</span>
              <br />
              <span className="text-muted-foreground">รถ: {mockData.vehicleName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleRejectConfirm} className="bg-destructive hover:bg-destructive/90">
              ยืนยันปฏิเสธ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
};
