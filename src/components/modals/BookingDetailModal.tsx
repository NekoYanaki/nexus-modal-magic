import { Car, Tent, MapPin, RefreshCw, User, Phone, Mail, Calendar, Clock, Shield, Download, X, CheckCircle2, XCircle, Pencil } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  // Toggle this to simulate vehicle-only vs vehicle+camp booking
  const hasCamp = true;

  const mockData = {
    code: "BK002",
    vehicleName: "Toyota Fortuner",
    status: bookingStatus,
    dateRange: "15–19 Mar 2024",
    customerName: "สมชาย ใจดี",
    customerPhone: "081-234-5678",
    customerEmail: "somchai@example.com",
    pickupDate: "15 Mar 2024, 09:00",
    returnDate: "19 Mar 2024, 17:00",
    totalDays: 4,
    vehicleModel: "Toyota Fortuner 2.8 4WD",
    licensePlate: "กข-1234 กรุงเทพมหานคร",
    vehicleType: "Motorhome A Class",
    insurance: "Insurance Class 1",
    campName: "ค่ายภูทับเบิก แพคเกจ VIP",
    campTotal: 3200,
    campPhone: "089-123-4567",
    deposit: 4000,
    vehicleRental: 12000,
    campFee: 3200,
    addonsTotal: 1200,
    totalPaid: 4000,
    totalDue: 15200,
    totalAmount: 19200,
    addons: [
      { name: "เบาะนั่งเด็ก", qty: 1, price: 300 },
      { name: "ชุดปิ้งย่าง", qty: 1, price: 350 },
      { name: "กันสาด", qty: 1, price: 400 },
      { name: "เก้าอี้พับ (ชุด)", qty: 1, price: 150 },
    ],
  };

  const remaining = mockData.totalAmount - mockData.totalPaid;

  const handleRejectConfirm = () => {
    setBookingStatus("rejected");
    setShowRejectConfirm(false);
    toast.success("ปฏิเสธการจองสำเร็จ");
  };

  const getStatusBadge = () => {
    const map: Record<string, { bg: string; text: string; label: string }> = {
      confirmed: { bg: "bg-success/10", text: "text-success", label: "Confirmed" },
      picked_up: { bg: "bg-primary/10", text: "text-primary", label: "Picked Up" },
      returned: { bg: "bg-info/10", text: "text-info", label: "Returned" },
      rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "Rejected" },
    };
    const s = map[bookingStatus] || { bg: "bg-muted", text: "text-muted-foreground", label: bookingStatus };
    return <Badge className={`${s.bg} ${s.text} border-transparent text-sm px-3 py-1`}>{s.label}</Badge>;
  };

  const getPaymentBadge = () => {
    if (remaining === 0) return <Badge className="bg-success/10 text-success border-transparent">Fully Paid</Badge>;
    if (mockData.totalPaid > 0) return <Badge className="bg-warning/10 text-warning border-transparent">Partial</Badge>;
    return <Badge className="bg-destructive/10 text-destructive border-transparent">Unpaid</Badge>;
  };

  const getRemainingColor = () => {
    if (remaining === 0) return "text-success";
    if (mockData.totalPaid > 0) return "text-warning";
    return "text-destructive";
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[860px] max-h-[90vh] p-0 gap-0 overflow-hidden flex flex-col">
        {/* ── Sticky Header ── */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-6 py-4 space-y-3">
          {/* Row 1: ID + Status + Dates */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight">{mockData.code}</h2>
              {getStatusBadge()}
              <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {mockData.dateRange}
              </span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Row 2: Financial Badges + Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Financial pills */}
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 bg-secondary rounded-lg px-3 py-1.5">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">฿{mockData.totalAmount.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-success/10 rounded-lg px-3 py-1.5">
                <span className="text-success/70">Paid</span>
                <span className="font-bold text-success">฿{mockData.totalPaid.toLocaleString()}</span>
              </div>
              <div className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 ${remaining === 0 ? 'bg-success/10' : mockData.totalPaid > 0 ? 'bg-warning/10' : 'bg-destructive/10'}`}>
                <span className={`${getRemainingColor()} opacity-70`}>Remaining</span>
                <span className={`font-bold ${getRemainingColor()}`}>฿{remaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" onClick={() => setShowDocument(true)}>
                <Download className="w-3.5 h-3.5" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                className="gap-1.5 bg-success hover:bg-success/90 text-success-foreground"
                disabled={bookingStatus === "rejected" || bookingStatus === "returned"}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/10"
                onClick={() => setShowRejectConfirm(true)}
                disabled={bookingStatus === "rejected" || bookingStatus === "returned"}
              >
                <XCircle className="w-3.5 h-3.5" />
                Reject
              </Button>
            </div>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* 1️⃣ Booking Overview */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Booking Overview</h3>
            <Card className="p-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <User className="w-3.5 h-3.5" /> Customer
                  </div>
                  <p className="font-medium">{mockData.customerName}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </div>
                  <p className="font-medium">{mockData.customerPhone}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </div>
                  <p className="font-medium">{mockData.customerEmail}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" /> Pickup
                  </div>
                  <p className="font-medium">{mockData.pickupDate}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" /> Return
                  </div>
                  <p className="font-medium">{mockData.returnDate}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" /> Duration
                  </div>
                  <p className="font-medium">{mockData.totalDays} days</p>
                </div>
              </div>
            </Card>
          </section>

          {/* 2️⃣ Vehicle & Camp */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {hasCamp ? "Vehicle & Camp" : "Vehicle"}
            </h3>
            <Card className="p-4">
              {/* Vehicle Section */}
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <Car className="w-4 h-4 text-primary" /> Vehicle
                </h4>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs gap-1 text-muted-foreground"
                  onClick={() => setShowVehicleSelection(true)}
                >
                  <RefreshCw className="w-3 h-3" />
                  Change
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model</span>
                  <span className="font-medium text-right">{selectedVehicle ? `${selectedVehicle.name} ${selectedVehicle.year}` : mockData.vehicleModel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Plate</span>
                  <span className="font-medium">{selectedVehicle ? selectedVehicle.licensePlate : mockData.licensePlate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium">{selectedVehicle ? selectedVehicle.type : mockData.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Insurance</span>
                  <span className="font-medium flex items-center gap-1"><Shield className="w-3 h-3 text-success" />{mockData.insurance}</span>
                </div>
              </div>

              {/* Camp Section — only if booked */}
              {hasCamp && (
                <>
                  <Separator className="my-4" />
                  <h4 className="font-semibold flex items-center gap-2 text-sm mb-3">
                    <Tent className="w-4 h-4 text-primary" /> Camp
                  </h4>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-right">{mockData.campName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-medium">฿{mockData.campTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tel.</span>
                      <span className="font-medium">{mockData.campPhone}</span>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </section>

          {/* 3️⃣ Financial Summary — emphasized */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Financial Summary</h3>
            <Card className="p-5 border-2 border-primary/20 bg-primary/[0.02]">
              <div className="grid grid-cols-2 gap-6">
                {/* Cost Breakdown */}
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Cost Breakdown</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Vehicle Rental</span>
                      <span className="font-medium">฿{mockData.vehicleRental.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Camp Fee</span>
                      <span className="font-medium">฿{mockData.campFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Add-ons</span>
                      <span className="font-medium">฿{mockData.addonsTotal.toLocaleString()}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold">Total</span>
                      <span className="text-xl font-bold">฿{mockData.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Status</h4>
                    {getPaymentBadge()}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Paid</span>
                      <span className="font-semibold text-success">฿{mockData.totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining</span>
                      <span className={`font-semibold ${getRemainingColor()}`}>฿{remaining.toLocaleString()}</span>
                    </div>
                    <Separator className="my-1" />
                    <div className="flex justify-between items-baseline">
                      <span className="text-muted-foreground">Deposit</span>
                      <span className="font-medium">฿{mockData.deposit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </section>

          {/* 4️⃣ Add-ons & Accessories */}
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Add-ons & Accessories</h3>
            <Card className="p-4">
              <div className="space-y-2 text-sm">
                {mockData.addons.map((addon, i) => (
                  <div key={i} className="flex items-center justify-between py-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-secondary text-muted-foreground rounded px-1.5 py-0.5 text-xs font-mono">×{addon.qty}</span>
                      <span>{addon.name}</span>
                    </div>
                    <span className="font-medium">฿{addon.price.toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between pt-1">
                  <span className="font-semibold">Total Add-ons</span>
                  <span className="font-semibold text-primary">฿{mockData.addonsTotal.toLocaleString()}</span>
                </div>
              </div>
            </Card>
          </section>
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
