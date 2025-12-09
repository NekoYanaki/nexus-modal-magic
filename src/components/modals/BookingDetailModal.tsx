import { Car, Tent, MapPin, LogIn, LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingDocumentModal } from "./BookingDocumentModal";
import { InspectionCard } from "./InspectionCard";
import { useState } from "react";
import { toast } from "sonner";

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({ open, onClose }: BookingDetailModalProps) => {
  const [showDocument, setShowDocument] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("confirmed");
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  
  // Mock data
  const mockData = {
    code: "BK002",
    vehicleName: "Toyota Fortuner",
    status: bookingStatus,
    dateRange: "15–19 Mar 2024",
    customerName: "สมชาย ใจดี",
    customerPhone: "081-234-5678",
    customerEmail: "somchai@example.com",
    pickupDate: "15 Mar 2024",
    totalDays: 4,
    vehicleModel: "Toyota Fortuner 2.8 4WD",
    licensePlate: "กข-1234 กรุงเทพมหานคร",
    insurance: "Insurance Class 1",
    campName: "ค่ายภูทับเบิก แพคเกจ VIP",
    campTotal: 3200,
    campPhone: "089-123-4567",
    deposit: 4000,
    vehicleRental: 12000,
    campFee: 3200,
    totalPaid: 4000,
    totalDue: 15200,
  };

  const handlePrint = () => {
    setShowDocument(true);
  };

  const handlePickupConfirm = () => {
    setBookingStatus("picked_up");
    setShowPickupConfirm(false);
    toast.success("อัปเดตสถานะเป็น Picked Up สำเร็จ");
  };

  const handleReturnConfirm = () => {
    setBookingStatus("returned");
    setShowReturnConfirm(false);
    toast.success("อัปเดตสถานะเป็น Returned สำเร็จ");
  };

  const handleRejectConfirm = () => {
    setBookingStatus("rejected");
    setShowRejectConfirm(false);
    toast.success("ปฏิเสธการจองสำเร็จ");
  };

  const getStatusBadge = () => {
    switch (bookingStatus) {
      case "confirmed":
        return <Badge className="bg-success/10 text-success border-success/20">Confirmed</Badge>;
      case "picked_up":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Picked Up</Badge>;
      case "returned":
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Returned</Badge>;
      case "rejected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return <Badge className="bg-muted/10 text-muted-foreground border-muted/20">{bookingStatus}</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Car className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold">{mockData.code}</h2>
                {getStatusBadge()}
                <span className="text-sm text-muted-foreground">{mockData.dateRange}</span>
              </div>
              <p className="text-base font-medium">{mockData.vehicleName}</p>
              <p className="text-sm text-muted-foreground">
                {mockData.customerName} • {mockData.customerPhone}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2" onClick={handlePrint}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                Bookingconfirmation.pdf
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowPickupConfirm(true)}
                disabled={bookingStatus !== "confirmed"}
              >
                <LogIn className="w-4 h-4" />
                Pick Up
              </Button>
              <Button 
                size="sm" 
                className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowReturnConfirm(true)}
                disabled={bookingStatus !== "picked_up"}
              >
                <LogOut className="w-4 h-4" />
                Return
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setShowRejectConfirm(true)}
                disabled={bookingStatus === "rejected" || bookingStatus === "returned"}
              >
                Reject
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Left Column - Main Content (2/3) */}
          <div className="col-span-2 space-y-4">
            {/* Information Header */}
            <h3 className="text-lg font-semibold mb-4">Information</h3>

            {/* Booking Information Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Booking Information
              </h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Booking ID</p>
                  <p className="font-medium">{mockData.code}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Status</p>
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    Confirmed
                  </Badge>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Customer Info</p>
                  <p className="font-medium">{mockData.customerName}</p>
                  <p className="text-xs text-muted-foreground">{mockData.customerPhone}</p>
                  <p className="text-xs text-muted-foreground">{mockData.customerEmail}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Pick Up Date</p>
                  <p className="font-medium">{mockData.pickupDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total Days</p>
                  <p className="font-medium">{mockData.totalDays} days</p>
                </div>
              </div>
            </Card>

            {/* Vehicle Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle
              </h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Model</p>
                  <p className="font-medium">{mockData.vehicleModel}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">License Plate</p>
                  <p className="font-medium">{mockData.licensePlate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Insurance</p>
                  <p className="font-medium">{mockData.insurance}</p>
                </div>
              </div>
            </Card>

            {/* Camp Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Tent className="w-4 h-4" />
                Camp
              </h4>
              <div className="grid grid-cols-2 gap-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Camp Name</p>
                  <p className="font-medium">{mockData.campName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Total</p>
                  <p className="font-medium">฿{mockData.campTotal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Camp Tel.</p>
                  <p className="font-medium">{mockData.campPhone}</p>
                </div>
              </div>
            </Card>

            {/* Payment Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Payment</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deposit</span>
                  <span className="font-medium">฿{mockData.deposit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vehicle Rental</span>
                  <span className="font-medium">฿{mockData.vehicleRental.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Camp Fee</span>
                  <span className="font-medium">฿{mockData.campFee.toLocaleString()}</span>
                </div>
              </div>
            </Card>

            {/* Inspection Card - รับรถ คืนรถ */}
            <InspectionCard />
          </div>

          {/* Right Sidebar (1/3) */}
          <div className="space-y-4">
            {/* Add-ons & Options Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="text-primary">+</span>
                Add-ons & Options
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>GPS Navigation</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Included
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Child Safety Seat</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Included
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Extra Driver</span>
                  <Badge variant="outline" className="text-xs">
                    Not Included
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Insurance Upgrade</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Included
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Camping Equipment</span>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                    Included
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Cost Summary Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Cost Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="font-semibold text-success">
                    ฿{mockData.totalPaid.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="font-semibold text-warning">
                    ฿{mockData.totalDue.toLocaleString()}
                  </span>
                </div>
                <div className="h-px bg-border my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-lg">
                    ฿{(mockData.totalPaid + mockData.totalDue).toLocaleString()}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>

      {/* Booking Document Modal */}
      <BookingDocumentModal 
        open={showDocument}
        onClose={() => setShowDocument(false)}
        bookingData={mockData}
      />

      {/* Pick Up Confirmation Dialog */}
      <AlertDialog open={showPickupConfirm} onOpenChange={setShowPickupConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการรับรถ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะการจอง <strong>{mockData.code}</strong> เป็น "Picked Up" ใช่หรือไม่?
              <br /><br />
              <span className="text-muted-foreground">ลูกค้า: {mockData.customerName}</span>
              <br />
              <span className="text-muted-foreground">รถ: {mockData.vehicleName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handlePickupConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              ยืนยันรับรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Confirmation Dialog */}
      <AlertDialog open={showReturnConfirm} onOpenChange={setShowReturnConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการคืนรถ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะการจอง <strong>{mockData.code}</strong> เป็น "Returned" ใช่หรือไม่?
              <br /><br />
              <span className="text-muted-foreground">ลูกค้า: {mockData.customerName}</span>
              <br />
              <span className="text-muted-foreground">รถ: {mockData.vehicleName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnConfirm} className="bg-blue-600 hover:bg-blue-700">
              ยืนยันคืนรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
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
