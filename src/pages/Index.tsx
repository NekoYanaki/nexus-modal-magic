import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingDetailModal } from "@/components/modals/BookingDetailModal";
import { PartnerDetailModal } from "@/components/modals/PartnerDetailModal";
import { CampsiteDetailModal } from "@/components/modals/CampsiteDetailModal";
import { CustomerDetailModal } from "@/components/modals/CustomerDetailModal";
import { PaymentDetailModal } from "@/components/modals/PaymentDetailModal";
import { PickupInspectionModal } from "@/components/modals/PickupInspectionModal";
import { ReturnInspectionModal } from "@/components/modals/ReturnInspectionModal";
import { Calendar, Users, Tent, UserCircle, CreditCard, LogIn, LogOut } from "lucide-react";

const Index = () => {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [partnerOpen, setPartnerOpen] = useState(false);
  const [campsiteOpen, setCampsiteOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [pickupOpen, setPickupOpen] = useState(false);
  const [returnOpen, setReturnOpen] = useState(false);
  const [pickupStatus, setPickupStatus] = useState("confirmed");
  const [returnStatus, setReturnStatus] = useState("picked_up");
  const mockPaymentData = {
    id: "PAY005",
    bookingRef: "BK0005",
    status: "success" as const,
    customerName: "สมชาย ใจดี",
    email: "somchai@example.com",
    phone: "081-234-5678",
    paymentMethod: "Credit Card",
    paymentChannel: "Visa **** 1234",
    paymentDate: "15 พ.ย. 2025, 14:30 น.",
    totalAmount: 8500,
    feeAmount: 150,
    netReceived: 8350,
    currency: "THB",
    refId: "TXN1122334455",
    partnerName: "แคมป์ดอยสุเทพ",
    partnerType: "Campsite" as const,
    payoutDate: "20 พ.ย. 2025",
    commissionRate: 10,
    partnerNet: 7515,
    transactionId: "TXN-2025-11-001234",
    gateway: "Omise",
    sessionId: "sess_5f8a9b2c1d3e4f",
    discountCode: "SUMMER2025",
    discountAmount: 500,
    paymentType: "Full Payment",
    createdAt: "15 พ.ย. 2025, 14:25 น.",
    updatedAt: "15 พ.ย. 2025, 14:30 น.",
    bookingCode: "BK0005",
    tripName: "เที่ยวภาคเหนือ 5 วัน 4 คืน",
    vehicles: "Toyota Hiace Camper",
    camps: "แคมป์ดอยสุเทพ",
    startDate: "20 พ.ย. 2025",
    endDate: "24 พ.ย. 2025",
    bookingTotalPrice: 8500,
    customerTotalPayments: 25600,
    customerLastBooking: "15 พ.ย. 2025",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RVNcamp Management System
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Car Rental & Camping Admin Dashboard - Modern modal system with consistent design
          </p>
        </header>

        {/* Modal Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {/* Booking Detail Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Booking Details</h3>
              <p className="text-muted-foreground mb-6">
                View and manage customer bookings with timeline, payment info, and notes
              </p>
              <Button 
                onClick={() => setBookingOpen(true)}
                className="w-full"
              >
                View Booking Modal
              </Button>
            </div>
          </div>

          {/* Pickup Inspection Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-emerald-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">รับรถ (Pick Up)</h3>
              <p className="text-muted-foreground mb-6">
                ตรวจสภาพรถก่อนส่งมอบ บันทึก Add-on และยืนยันการรับรถ
              </p>
              <Button 
                onClick={() => setPickupOpen(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
              >
                View Pickup Modal
              </Button>
            </div>
          </div>

          {/* Return Inspection Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                <LogOut className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">คืนรถ (Return)</h3>
              <p className="text-muted-foreground mb-6">
                ตรวจสภาพรถหลังคืน บันทึกความเสียหาย และยืนยันการคืนรถ
              </p>
              <Button 
                onClick={() => setReturnOpen(true)}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                View Return Modal
              </Button>
            </div>
          </div>

          {/* Payment Detail Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Payment Details</h3>
              <p className="text-muted-foreground mb-6">
                View transaction info, settlement details, and related booking information
              </p>
              <Button 
                onClick={() => setPaymentOpen(true)}
                className="w-full"
                variant="default"
              >
                View Payment Modal
              </Button>
            </div>
          </div>

          {/* Customer Detail Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mb-4">
                <UserCircle className="w-6 h-6 text-warning" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Customer Details</h3>
              <p className="text-muted-foreground mb-6">
                Access booking history, payment records, reviews, and customer notes
              </p>
              <Button 
                onClick={() => setCustomerOpen(true)}
                className="w-full"
                variant="default"
              >
                View Customer Modal
              </Button>
            </div>
          </div>

          {/* Campsite Detail Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mb-4">
                <Tent className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Campsite Details</h3>
              <p className="text-muted-foreground mb-6">
                View zones, pricing, availability calendar, and customer reviews
              </p>
              <Button 
                onClick={() => setCampsiteOpen(true)}
                className="w-full"
                variant="default"
              >
                View Campsite Modal
              </Button>
            </div>
          </div>

          {/* Partner Detail Card */}
          <div className="group relative bg-card border border-border rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Partner Details</h3>
              <p className="text-muted-foreground mb-6">
                Manage campsite partners, verification, payouts, and performance tracking
              </p>
              <Button 
                onClick={() => setPartnerOpen(true)}
                className="w-full"
                variant="default"
              >
                View Partner Modal
              </Button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Design System Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 bg-primary rounded-full" />
                </div>
                <h3 className="font-semibold mb-2">Consistent Colors</h3>
                <p className="text-sm text-muted-foreground">Purple/Blue gradient with semantic tokens</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="text-2xl font-bold">Aa</div>
                </div>
                <h3 className="font-semibold mb-2">Inter Typography</h3>
                <p className="text-sm text-muted-foreground">Clean, modern font family</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <div className="w-8 h-8 border-4 border-success rounded-xl" />
                </div>
                <h3 className="font-semibold mb-2">16px Radius</h3>
                <p className="text-sm text-muted-foreground">Soft, rounded corners</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <BookingDetailModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <PartnerDetailModal open={partnerOpen} onClose={() => setPartnerOpen(false)} />
      <CampsiteDetailModal open={campsiteOpen} onClose={() => setCampsiteOpen(false)} />
      <CustomerDetailModal open={customerOpen} onClose={() => setCustomerOpen(false)} />
      <PaymentDetailModal open={paymentOpen} onOpenChange={setPaymentOpen} payment={mockPaymentData} />
      <PickupInspectionModal 
        open={pickupOpen} 
        onClose={() => setPickupOpen(false)}
        bookingCode="BK002"
        customerName="สมชาย ใจดี"
        vehicleName="Toyota Fortuner"
        bookingStatus={pickupStatus}
        onStatusChange={setPickupStatus}
      />
      <ReturnInspectionModal 
        open={returnOpen} 
        onClose={() => setReturnOpen(false)}
        bookingCode="BK002"
        customerName="สมชาย ใจดี"
        vehicleName="Toyota Fortuner"
        bookingStatus={returnStatus}
        onStatusChange={setReturnStatus}
      />
    </div>
  );
};

export default Index;
