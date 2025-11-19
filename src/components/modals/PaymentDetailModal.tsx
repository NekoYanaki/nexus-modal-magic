import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw, Bell, CheckCircle2, Calendar } from "lucide-react";
import { PaymentReceiptModal } from "./PaymentReceiptModal";
import { useState } from "react";
interface PaymentDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment?: {
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
    // Additional fields for Camper & Campsite
    camperPartner?: string;
    camperNet?: number;
    camperCommission?: number;
    campsitePartner?: string;
    campsiteNet?: number;
    campsiteCommission?: number;
    transactionId: string;
    gateway: string;
    sessionId: string;
    discountCode?: string;
    discountAmount?: number;
    paymentType: string;
    createdAt: string;
    updatedAt: string;
    bookingCode: string;
    tripName: string;
    vehicles: string;
    camps: string;
    startDate: string;
    endDate: string;
    bookingTotalPrice: number;
    customerTotalPayments: number;
    customerLastBooking: string;
  };
}
export function PaymentDetailModal({
  open,
  onOpenChange,
  payment
}: PaymentDetailModalProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  
  if (!payment) return null;
  const statusConfig = {
    success: {
      label: "Success",
      className: "bg-green-500/10 text-green-600 border-green-500/20"
    },
    pending: {
      label: "Pending",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
    },
    failed: {
      label: "Failed",
      className: "bg-red-500/10 text-red-600 border-red-500/20"
    }
  };
  const currentStatus = statusConfig[payment.status];
  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <DialogHeader className="space-y-3 pb-4 border-b">
          <div className="flex items-center gap-3">
            <DialogTitle className="text-2xl">Payment Details</DialogTitle>
            <Badge variant="outline" className={currentStatus.className}>
              {currentStatus.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {payment.id} • Booking {payment.bookingRef}
          </p>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowReceipt(true)}>
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            {payment.status === "success" && <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refund
              </Button>}
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-6">
          {/* Row 1: Customer Information + Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{payment.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{payment.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{payment.phone}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Payment Date/Time</p>
                  <p className="font-medium">{payment.paymentDate}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                  <p className="text-2xl font-bold text-primary">
                    ฿{payment.totalAmount.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fee Amount</p>
                  <p className="font-medium">฿{payment.feeAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Net Received</p>
                  <p className="text-xl font-bold text-green-600">
                    ฿{payment.netReceived.toLocaleString()}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Currency</p>
                  <p className="font-medium">{payment.currency}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Row 2: Booking Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Information</CardTitle>
                <Button variant="outline" size="sm">
                  Open Booking Detail
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Booking Code</p>
                  <p className="font-medium text-lg">{payment.bookingCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trip Name</p>
                  <p className="font-medium">{payment.tripName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Vehicle(s)</p>
                  <p className="font-medium">{payment.vehicles}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Camp(s)</p>
                  <p className="font-medium">{payment.camps}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Start Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{payment.startDate}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">End Date</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <p className="font-medium">{payment.endDate}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-2xl font-bold text-primary">
                  ฿{payment.bookingTotalPrice.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Row 3: Settlement Info */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                {payment.payoutDate ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Bell className="h-5 w-5 text-yellow-600" />}
                <CardTitle className="text-base">
                  Settlement Information
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">Partner</p>
                  <p className="font-medium text-lg">{payment.partnerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partner Type</p>
                  <Badge variant="secondary">{payment.partnerType}</Badge>
                </div>
                
                {payment.partnerType === "Camper & Campsite" ? <>
                    {/* Dual Partner Settlement */}
                    <div className="md:col-span-2 pt-4 border-t">
                      <p className="text-sm font-semibold text-muted-foreground mb-4">
                        Camper Partner Settlement
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground">Camper Partner</p>
                          <p className="font-medium">{payment.camperPartner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commission Rate</p>
                          <p className="font-medium">{payment.camperCommission}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Net Amount</p>
                          <p className="text-lg font-bold text-primary">
                            ฿{payment.camperNet?.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-muted-foreground mb-4 pt-4 border-t">
                        Campsite Partner Settlement
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Campsite Partner</p>
                          <p className="font-medium">{payment.campsitePartner}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Commission Rate</p>
                          <p className="font-medium">{payment.campsiteCommission}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Net Amount</p>
                          <p className="text-lg font-bold text-primary">
                            ฿{payment.campsiteNet?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </> : <>
                    {/* Single Partner Settlement */}
                    <div>
                      <p className="text-sm text-muted-foreground">Commission Rate</p>
                      <p className="font-medium">{payment.commissionRate}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Partner Net Amount</p>
                      <p className="text-lg font-bold text-primary">
                        ฿{payment.partnerNet.toLocaleString()}
                      </p>
                    </div>
                  </>}

                <div>
                  <p className="text-sm text-muted-foreground">Payout Status</p>
                  {payment.payoutDate ? <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Paid Out
                    </Badge> : <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                      Pending
                    </Badge>}
                </div>
                {payment.payoutDate && <div>
                    <p className="text-sm text-muted-foreground">Payout Date</p>
                    <p className="font-medium">{payment.payoutDate}</p>
                  </div>}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
      
      {/* Payment Receipt Modal */}
      <PaymentReceiptModal 
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        paymentData={payment}
      />
    </Dialog>;
}