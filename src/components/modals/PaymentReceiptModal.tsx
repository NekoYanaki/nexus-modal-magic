import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";

interface PaymentReceiptModalProps {
  open: boolean;
  onClose: () => void;
  paymentData: {
    id: string;
    bookingRef: string;
    status: "success" | "pending" | "failed";
    customerName: string;
    email: string;
    phone: string;
    paymentMethod: string;
    paymentChannel: string;
    paymentDate: string;
    totalAmount: number;
    feeAmount: number;
    netReceived: number;
    currency: string;
    refId: string;
    partnerName: string;
    partnerType: "Camper" | "Campsite" | "Camper & Campsite";
    payoutDate?: string;
    commissionRate: number;
    partnerNet: number;
    camperPartner?: string;
    camperNet?: number;
    camperCommission?: number;
    campsitePartner?: string;
    campsiteNet?: number;
    campsiteCommission?: number;
    transactionId: string;
    gateway: string;
    tripName: string;
    startDate: string;
    endDate: string;
    bookingTotalPrice: number;
    discountCode?: string;
    discountAmount?: number;
  };
}

export const PaymentReceiptModal = ({ open, onClose, paymentData }: PaymentReceiptModalProps) => {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (amount: number) => {
    return `${paymentData.currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const statusLabel = {
    success: "Paid Successfully",
    pending: "Pending Payment",
    failed: "Payment Failed"
  }[paymentData.status];

  const statusColor = {
    success: "text-green-600",
    pending: "text-yellow-600",
    failed: "text-red-600"
  }[paymentData.status];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto p-0">
        {/* Header with Close and Print buttons - Hide on print */}
        <div className="sticky top-0 z-10 bg-background border-b px-6 py-3 flex justify-between items-center print:hidden">
          <h2 className="text-lg font-semibold">Payment Receipt Preview</h2>
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
        <div className="p-12 bg-white text-black print:p-8" id="payment-receipt">
          {/* Header */}
          <div className="text-center mb-8 border-b-2 border-primary pb-6">
            <h1 className="text-3xl font-bold text-primary mb-2">PAYMENT RECEIPT</h1>
            <p className="text-muted-foreground">ใบเสร็จรับเงิน</p>
          </div>

          {/* Receipt Info Header */}
          <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-primary/5 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Payment ID</p>
              <p className="text-2xl font-bold text-primary">{paymentData.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className={`text-xl font-semibold ${statusColor}`}>{statusLabel}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking Reference</p>
              <p className="text-lg font-medium">{paymentData.bookingRef}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Payment Date</p>
              <p className="text-lg font-medium">{paymentData.paymentDate}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">ข้อมูลลูกค้า / Customer Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อ-นามสกุล / Name</p>
                <p className="font-medium">{paymentData.customerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เบอร์โทรศัพท์ / Phone</p>
                <p className="font-medium">{paymentData.phone}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-muted-foreground">อีเมล / Email</p>
                <p className="font-medium">{paymentData.email}</p>
              </div>
            </div>
          </div>

          {/* Booking Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">รายละเอียดการจอง / Booking Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">ชื่อทริป / Trip Name</p>
                <p className="font-medium">{paymentData.tripName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ระยะเวลา / Period</p>
                <p className="font-medium">{paymentData.startDate} - {paymentData.endDate}</p>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">วิธีการชำระเงิน / Payment Method</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Payment Method</p>
                <p className="font-medium">{paymentData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Payment Channel</p>
                <p className="font-medium">{paymentData.paymentChannel}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-medium">{paymentData.transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reference ID</p>
                <p className="font-medium">{paymentData.refId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gateway</p>
                <p className="font-medium">{paymentData.gateway}</p>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">รายละเอียดการชำระเงิน / Payment Breakdown</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Booking Amount</span>
                <span className="font-medium">{formatCurrency(paymentData.bookingTotalPrice)}</span>
              </div>
              
              {paymentData.discountCode && (
                <>
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({paymentData.discountCode})</span>
                    <span>-{formatCurrency(paymentData.discountAmount || 0)}</span>
                  </div>
                  <div className="border-t pt-2" />
                </>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Amount</span>
                <span className="font-medium">{formatCurrency(paymentData.totalAmount)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Fee</span>
                <span className="text-muted-foreground">{formatCurrency(paymentData.feeAmount)}</span>
              </div>

              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total Paid</span>
                <span className="text-primary">{formatCurrency(paymentData.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Settlement Information */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">ข้อมูลการ Settle / Settlement Information</h2>
            
            {paymentData.partnerType === "Camper & Campsite" ? (
              <>
                {/* Camper Partner */}
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-semibold mb-3 text-blue-900">Camper Partner</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Partner Name</span>
                      <span className="font-medium">{paymentData.camperPartner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission</span>
                      <span className="font-medium">{formatCurrency(paymentData.camperCommission || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Net Amount</span>
                      <span className="font-semibold">{formatCurrency(paymentData.camperNet || 0)}</span>
                    </div>
                  </div>
                </div>

                {/* Campsite Partner */}
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold mb-3 text-green-900">Campsite Partner</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Partner Name</span>
                      <span className="font-medium">{paymentData.campsitePartner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Commission</span>
                      <span className="font-medium">{formatCurrency(paymentData.campsiteCommission || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Net Amount</span>
                      <span className="font-semibold">{formatCurrency(paymentData.campsiteNet || 0)}</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partner Name</span>
                  <span className="font-medium">{paymentData.partnerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Partner Type</span>
                  <span className="font-medium">{paymentData.partnerType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Rate</span>
                  <span className="font-medium">{paymentData.commissionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Commission Amount</span>
                  <span className="font-medium">{formatCurrency(paymentData.totalAmount * (paymentData.commissionRate / 100))}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Partner Net Amount</span>
                  <span className="text-primary">{formatCurrency(paymentData.partnerNet)}</span>
                </div>
                {paymentData.payoutDate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payout Date</span>
                    <span className="text-muted-foreground">{paymentData.payoutDate}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-sm text-muted-foreground">
            <p className="mb-2">Thank you for your payment / ขอบคุณสำหรับการชำระเงิน</p>
            <p>This is an automated receipt generated by RVNcamp Management System</p>
            <p className="mt-4">For questions about this receipt, please contact support@rvncamp.com</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
