import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";

interface BookingDocumentModalProps {
  open: boolean;
  onClose: () => void;
  bookingData: {
    code: string;
    vehicleName: string;
    dateRange: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    pickupDate: string;
    totalDays: number;
    vehicleModel: string;
    licensePlate: string;
    insurance: string;
    campName: string;
    campTotal: number;
    campPhone: string;
    deposit: number;
    vehicleRental: number;
    campFee: number;
    totalPaid: number;
    totalDue: number;
  };
}

export const BookingDocumentModal = ({ open, onClose, bookingData }: BookingDocumentModalProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header with Close and Print buttons - Hide on print */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex justify-between items-center print:hidden">
          <h2 className="text-lg font-semibold">Booking Document Preview</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <div className="p-12 bg-white text-black print:p-8" id="booking-document">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">BOOKING CONFIRMATION</h1>
            <p className="text-muted-foreground">รายละเอียดการจอง</p>
          </div>

          {/* Booking Info Header */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-primary/5 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="text-2xl font-bold text-primary">{bookingData.code}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-xl font-semibold text-green-600">Confirmed</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Period</p>
              <p className="text-lg font-medium">{bookingData.dateRange}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">ข้อมูลลูกค้า / Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ-นามสกุล / Name</p>
                <p className="font-medium">{bookingData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เบอร์โทรศัพท์ / Phone</p>
                <p className="font-medium">{bookingData.customerPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">อีเมล / Email</p>
                <p className="font-medium">{bookingData.customerEmail}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">วันรับรถ / Pick Up Date</p>
                <p className="font-medium">{bookingData.pickupDate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">จำนวนวัน / Total Days</p>
                <p className="font-medium">{bookingData.totalDays} days</p>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">ข้อมูลรถ / Vehicle Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">รุ่นรถ / Model</p>
                <p className="font-medium">{bookingData.vehicleModel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ทะเบียนรถ / License Plate</p>
                <p className="font-medium">{bookingData.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ประกันภัย / Insurance</p>
                <p className="font-medium">{bookingData.insurance}</p>
              </div>
            </div>
          </div>

          {/* Camp Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">ข้อมูลค่าย / Camp Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อค่าย / Camp Name</p>
                <p className="font-medium">{bookingData.campName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เบอร์ค่าย / Camp Tel.</p>
                <p className="font-medium">{bookingData.campPhone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ค่าค่าย / Camp Fee</p>
                <p className="font-medium">฿{bookingData.campTotal.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">สรุปการชำระเงิน / Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">มัดจำ / Deposit</span>
                <span className="font-medium">฿{bookingData.deposit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">ค่าเช่ารถ / Vehicle Rental</span>
                <span className="font-medium">฿{bookingData.vehicleRental.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">ค่าค่าย / Camp Fee</span>
                <span className="font-medium">฿{bookingData.campFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 bg-green-50 px-4 rounded">
                <span className="font-semibold">ชำระแล้ว / Total Paid</span>
                <span className="font-bold text-green-600 text-lg">฿{bookingData.totalPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-3 bg-red-50 px-4 rounded">
                <span className="font-semibold">ยอดคงค้าง / Total Due</span>
                <span className="font-bold text-red-600 text-xl">฿{bookingData.totalDue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="mb-2">ขอบคุณที่ใช้บริการ / Thank you for your booking!</p>
            <p>หากมีข้อสงสัยกรุณาติดต่อฝ่ายบริการลูกค้า / For inquiries, please contact our customer service.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
