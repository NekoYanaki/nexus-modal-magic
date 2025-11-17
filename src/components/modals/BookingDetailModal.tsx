import { Car, Tent, Phone, Mail, User as UserIcon, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import jsPDF from "jspdf";

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({ open, onClose }: BookingDetailModalProps) => {
  // Mock data
  const mockData = {
    code: "BK002",
    vehicleName: "Toyota Fortuner",
    status: "confirmed",
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
    const doc = new jsPDF();
    
    // Set font for Thai support (using default font)
    doc.setFont("helvetica");
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(59, 130, 246); // primary color
    doc.text("BOOKING CONFIRMATION", 105, 20, { align: "center" });
    
    // Booking Code and Status
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Booking ID: ${mockData.code}`, 20, 35);
    doc.setTextColor(34, 197, 94); // success color
    doc.text("Status: Confirmed", 120, 35);
    
    // Date Range
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Period: ${mockData.dateRange}`, 20, 42);
    
    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 48, 190, 48);
    
    // Customer Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Customer Information", 20, 58);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Name: ${mockData.customerName}`, 25, 66);
    doc.text(`Phone: ${mockData.customerPhone}`, 25, 72);
    doc.text(`Email: ${mockData.customerEmail}`, 25, 78);
    doc.text(`Pick Up Date: ${mockData.pickupDate}`, 25, 84);
    doc.text(`Total Days: ${mockData.totalDays} days`, 25, 90);
    
    // Vehicle Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Vehicle Information", 20, 105);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Model: ${mockData.vehicleModel}`, 25, 113);
    doc.text(`License Plate: ${mockData.licensePlate}`, 25, 119);
    doc.text(`Insurance: ${mockData.insurance}`, 25, 125);
    
    // Camp Information
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Camp Information", 20, 140);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Camp Name: ${mockData.campName}`, 25, 148);
    doc.text(`Camp Tel: ${mockData.campPhone}`, 25, 154);
    doc.text(`Camp Fee: ${mockData.campTotal.toLocaleString()} THB`, 25, 160);
    
    // Divider
    doc.line(20, 170, 190, 170);
    
    // Payment Summary
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Summary", 20, 180);
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Deposit:`, 25, 188);
    doc.text(`${mockData.deposit.toLocaleString()} THB`, 160, 188, { align: "right" });
    doc.text(`Vehicle Rental:`, 25, 194);
    doc.text(`${mockData.vehicleRental.toLocaleString()} THB`, 160, 194, { align: "right" });
    doc.text(`Camp Fee:`, 25, 200);
    doc.text(`${mockData.campFee.toLocaleString()} THB`, 160, 200, { align: "right" });
    
    // Divider
    doc.setLineWidth(0.5);
    doc.line(25, 205, 160, 205);
    
    // Totals
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Paid:`, 25, 213);
    doc.setTextColor(34, 197, 94); // success color
    doc.text(`${mockData.totalPaid.toLocaleString()} THB`, 160, 213, { align: "right" });
    
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Due:`, 25, 221);
    doc.setTextColor(239, 68, 68); // red color
    doc.setFontSize(12);
    doc.text(`${mockData.totalDue.toLocaleString()} THB`, 160, 221, { align: "right" });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your booking!", 105, 270, { align: "center" });
    doc.text("For inquiries, please contact our customer service.", 105, 275, { align: "center" });
    
    // Open PDF in new window
    window.open(doc.output('bloburl'), '_blank');
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
                <Badge className="bg-success/10 text-success border-success/20">
                  Confirmed
                </Badge>
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
                Print
              </Button>
              <Button size="sm" className="bg-success hover:bg-success/90">
                Approve
              </Button>
              <Button size="sm" variant="destructive">
                Cancel
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
    </Dialog>
  );
};
