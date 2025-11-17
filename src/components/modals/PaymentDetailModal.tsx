import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, RefreshCw, CreditCard, Building2, Bell, CheckCircle2, Calendar } from "lucide-react";
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

        <div className="mt-4">
          {/* Main Content */}
          <div>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="transaction">Transaction Info</TabsTrigger>
                <TabsTrigger value="booking">Related Booking</TabsTrigger>
              </TabsList>

              {/* Tab 1: Summary */}
              <TabsContent value="summary" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
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
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <div className="flex items-center gap-2 mt-1">
                          {payment.paymentMethod === "Credit Card" && <CreditCard className="h-4 w-4" />}
                          {payment.paymentMethod === "Bank Transfer" && <Building2 className="h-4 w-4" />}
                          <p className="font-medium">{payment.paymentMethod}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Channel</p>
                        <p className="font-medium">{payment.paymentChannel}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Date/Time</p>
                        <p className="font-medium">{payment.paymentDate}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right Column */}
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
                      <div>
                        <p className="text-sm text-muted-foreground">Reference ID</p>
                        <p className="font-medium font-mono text-xs">{payment.refId}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Settlement Info */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="text-base">Settlement Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {payment.partnerType === "Camper & Campsite" ? <>
                        {/* Camper Section */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm border-b pb-2">Camper Settlement</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Partner</p>
                              <p className="font-medium">{payment.camperPartner || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Commission Rate</p>
                              <p className="font-medium">{payment.camperCommission || 0}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Partner Net</p>
                              <p className="text-lg font-bold text-primary">
                                ฿{(payment.camperNet || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Campsite Section */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-sm border-b pb-2">Campsite Settlement</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Partner</p>
                              <p className="font-medium">{payment.campsitePartner || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Commission Rate</p>
                              <p className="font-medium">{payment.campsiteCommission || 0}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Partner Net</p>
                              <p className="text-lg font-bold text-primary">
                                ฿{(payment.campsiteNet || 0).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {payment.payoutDate && <div className="pt-2 border-t">
                            <p className="text-sm text-muted-foreground">Payout Date</p>
                            <p className="font-medium">{payment.payoutDate}</p>
                          </div>}
                      </> : <>
                        {/* Single Partner (Camper or Campsite) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Partner</p>
                            <p className="font-medium">{payment.partnerName}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Type</p>
                            <p className="font-medium">{payment.partnerType}</p>
                          </div>
                          {payment.payoutDate && <div>
                              <p className="text-sm text-muted-foreground">Payout Date</p>
                              <p className="font-medium">{payment.payoutDate}</p>
                            </div>}
                          <div>
                            <p className="text-sm text-muted-foreground">Commission Rate</p>
                            <p className="font-medium">{payment.commissionRate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Partner Net</p>
                            <p className="text-lg font-bold text-primary">
                              ฿{payment.partnerNet.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </>}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 2: Transaction Info */}
              <TabsContent value="transaction" className="space-y-4 mt-6">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Payment ID</p>
                        <p className="font-medium font-mono text-sm">{payment.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction ID</p>
                        <p className="font-medium font-mono text-sm">{payment.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gateway</p>
                        <p className="font-medium">{payment.gateway}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Session ID</p>
                        <p className="font-medium font-mono text-sm">{payment.sessionId}</p>
                      </div>
                      {payment.discountCode && <>
                          <div>
                            <p className="text-sm text-muted-foreground">Discount Code</p>
                            <p className="font-medium">{payment.discountCode}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Discount Amount</p>
                            <p className="font-medium text-green-600">
                              -฿{payment.discountAmount?.toLocaleString()}
                            </p>
                          </div>
                        </>}
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Type</p>
                        <p className="font-medium">{payment.paymentType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Created At</p>
                        <p className="font-medium">{payment.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Updated At</p>
                        <p className="font-medium">{payment.updatedAt}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tab 3: Related Booking */}
              <TabsContent value="booking" className="space-y-4 mt-6">
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
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          
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