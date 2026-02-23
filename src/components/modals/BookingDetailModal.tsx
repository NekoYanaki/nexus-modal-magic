import { Car, Tent, RefreshCw, MapPin, Calendar, X, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BookingDocumentModal } from "./BookingDocumentModal";
import { VehicleSelectionDialog, type SelectableVehicle } from "./VehicleSelectionDialog";
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
  const [selectedVehicle, setSelectedVehicle] = useState<SelectableVehicle | null>(null);

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
    campName: "ป่าสนแคมปิ้ง",
    campTotal: 150,
    campFee: 150,
    campPhone: "099999999",
    deposit: 4000,
    vehicleRental: 5000,
    addonsTotal: 0,
    totalPaid: 4000,
    totalDue: 1150,
    totalAmount: 5150,
    addons: [
      { name: "AC in living area", included: true },
      { name: "Bluetooth", included: true },
      { name: "TV", included: true },
      { name: "Floor heating", included: true },
      { name: "Aux-port", included: true },
      { name: "Mosquito net", included: true },
      { name: "Adapter to electrical connection", included: true },
      { name: "Solar panel", included: true },
      { name: "Freezer", included: true },
      { name: "Cooking plate", included: true },
      { name: "Fridge", included: true },
      { name: "Kitchen equipment", included: true },
      { name: "Oven", included: true },
      { name: "Microwave oven", included: true },
      { name: "Toilet", included: true },
      { name: "Shower", included: true },
      { name: "Hot water", included: true },
      { name: "AC in cab", included: true },
      { name: "GPS", included: true },
    ],
    amenities: ["ห้องน้ำ", "ไฟฟ้า", "น้ำประปา"],
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
                  onClick={() => setShowVehicleSelection(true)}
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
                  <p className="text-muted-foreground text-xs mb-0.5">Insurance</p>
                  <p className="font-medium">{mockData.insurance}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs mb-0.5">Rental Fee</p>
                  <p className="font-medium">฿{mockData.rentalFee.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            {/* Camp — only if booked */}
            {hasCamp && (
              <Card className="p-5 border border-border">
                <h4 className="font-semibold flex items-center gap-2 mb-4">
                  <Tent className="w-4 h-4 text-primary" />
                  Camp
                </h4>
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Camp Name</p>
                    <p className="font-medium">{mockData.campName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-muted-foreground text-xs mb-0.5">Camp Fee</p>
                    <p className="font-medium">฿{mockData.campFee.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-0.5">Camp Tel.</p>
                    <p className="font-medium">{mockData.campPhone}</p>
                  </div>
                </div>

                {mockData.amenities && mockData.amenities.length > 0 && (
                  <>
                    <Separator className="my-4" />
                    <p className="text-muted-foreground text-xs mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-1.5">
                      {mockData.amenities.map((a, i) => (
                        <Badge key={i} variant="secondary" className="text-xs font-normal">{a}</Badge>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            )}
          </div>

          {/* Right Sidebar (1/3) — Add-ons & Options */}
          <div>
            <Card className="p-5 border border-border">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <span className="text-primary font-bold">+</span>
                Add-ons & Options
              </h4>
              <div className="space-y-2.5">
                {mockData.addons.map((addon, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span>{addon.name}</span>
                    <Badge variant="outline" className="text-xs font-normal bg-primary/5 text-primary border-primary/20 shrink-0 ml-2">
                      Included
                    </Badge>
                  </div>
                ))}
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

      <VehicleSelectionDialog
        open={showVehicleSelection}
        onClose={() => setShowVehicleSelection(false)}
        currentVehicleId={selectedVehicle?.id}
        onSelect={(vehicle) => {
          setSelectedVehicle(vehicle);
          toast.success(`เปลี่ยนรถเป็น ${vehicle.name} สำเร็จ`);
        }}
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
