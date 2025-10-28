import { useState } from "react";
import { X, Calendar, User, MapPin, DollarSign, Clock, FileText, MessageSquare } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface BookingDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const BookingDetailModal = ({ open, onClose }: BookingDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">BK20240115</h2>
                <Badge className="bg-success text-success-foreground">Confirmed</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  Somchai Jaidee
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  15 Jan - 17 Jan 2024
                </span>
                <span className="flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  ฿4,500
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="destructive" size="sm">Cancel</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Campsite Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> Doi Suthep Campsite</p>
                    <p><span className="text-muted-foreground">Zone:</span> A - Mountain View</p>
                    <p><span className="text-muted-foreground">Spot:</span> A12</p>
                    <p><span className="text-muted-foreground">Check-in:</span> 15 Jan 2024, 14:00</p>
                    <p><span className="text-muted-foreground">Check-out:</span> 17 Jan 2024, 12:00</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> Somchai Jaidee</p>
                    <p><span className="text-muted-foreground">Phone:</span> 081-234-5678</p>
                    <p><span className="text-muted-foreground">Email:</span> somchai@example.com</p>
                    <p><span className="text-muted-foreground">Guests:</span> 2 Adults, 1 Child</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold">Vehicle Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Type:</span> RV - Class B</p>
                    <p><span className="text-muted-foreground">Plate:</span> กข 1234 กรุงเทพ</p>
                    <p><span className="text-muted-foreground">Model:</span> Mercedes Sprinter 2022</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price (2 nights)</span>
                    <span>฿3,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Extra Person</span>
                    <span>฿500</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span>฿300</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-primary">฿4,500</span>
                  </div>
                  <Badge className="bg-success text-success-foreground w-full justify-center">Paid</Badge>
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Booking Created</p>
                      <p className="text-xs text-muted-foreground">10 Jan 2024, 10:30</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payment Confirmed</p>
                      <p className="text-xs text-muted-foreground">10 Jan 2024, 10:45</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-info mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Check-in Expected</p>
                      <p className="text-xs text-muted-foreground">15 Jan 2024, 14:00</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="Add internal notes here..."
                  />
                  <Button size="sm">Add Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Download Invoice
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Customer
                </Button>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Booking Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">2 nights</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Guests</span>
                  <span className="font-medium">3 people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">5 days ago</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Contact Info</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">081-234-5678</p>
                <p className="text-muted-foreground mt-3">Email</p>
                <p className="font-medium break-all">somchai@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
