import { useState } from "react";
import { User, Phone, Mail, CreditCard, Star, MessageSquare, TrendingUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const CustomerDetailModal = ({ open, onClose }: CustomerDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Somchai Jaidee</h2>
                <Badge className="bg-success text-success-foreground">Active</Badge>
                <span className="text-sm text-muted-foreground">CU001</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  somchai@example.com
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  081-234-5678
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Contact</Button>
              <Button variant="outline" size="sm">Ban</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Full Name:</span> Somchai Jaidee</p>
                    <p><span className="text-muted-foreground">Email:</span> somchai@example.com</p>
                    <p><span className="text-muted-foreground">Phone:</span> 081-234-5678</p>
                    <p><span className="text-muted-foreground">Date of Birth:</span> 15 March 1990</p>
                    <p><span className="text-muted-foreground">Member Since:</span> 10 January 2023</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Address</h3>
                  <div className="space-y-2 text-sm">
                    <p>123/45 Sukhumvit Road</p>
                    <p>Khlong Toei, Bangkok 10110</p>
                    <p>Thailand</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Identity Information</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">ID Number:</span> 1-2345-67890-12-3</p>
                    <p><span className="text-muted-foreground">Driver License:</span> 12345678</p>
                    <div className="mt-2">
                      <Badge className="bg-success text-success-foreground">ID Verified</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4 mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-semibold">Code</th>
                        <th className="text-left p-3 font-semibold">Dates</th>
                        <th className="text-left p-3 font-semibold">Campsite</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                        <th className="text-left p-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3">BK20240115</td>
                        <td className="p-3">15-17 Jan</td>
                        <td className="p-3">Doi Suthep</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">Confirmed</Badge>
                        </td>
                        <td className="p-3 font-medium">฿4,500</td>
                      </tr>
                      <tr>
                        <td className="p-3">BK20231220</td>
                        <td className="p-3">20-22 Dec</td>
                        <td className="p-3">Khao Yai Camp</td>
                        <td className="p-3">
                          <Badge variant="outline">Completed</Badge>
                        </td>
                        <td className="p-3 font-medium">฿3,800</td>
                      </tr>
                      <tr>
                        <td className="p-3">BK20231105</td>
                        <td className="p-3">5-7 Nov</td>
                        <td className="p-3">Hua Hin Beach</td>
                        <td className="p-3">
                          <Badge variant="outline">Completed</Badge>
                        </td>
                        <td className="p-3 font-medium">฿5,200</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="payments" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TXN20240115001</p>
                        <p className="text-xs text-muted-foreground">15 Jan 2024, 10:45</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿4,500</p>
                      <Badge className="bg-success text-success-foreground">Success</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TXN20231220001</p>
                        <p className="text-xs text-muted-foreground">20 Dec 2023, 14:20</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿3,800</p>
                      <Badge className="bg-success text-success-foreground">Success</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TXN20231105001</p>
                        <p className="text-xs text-muted-foreground">5 Nov 2023, 09:15</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿5,200</p>
                      <Badge className="bg-success text-success-foreground">Success</Badge>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Payment Methods</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">•••• •••• •••• 1234</span>
                      </div>
                      <Badge variant="outline">Default</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Doi Suthep Campsite</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">18 Jan 2024</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing experience! Beautiful views and excellent facilities. Will definitely come back.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Khao Yai Camp</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                          <Star className="w-3 h-3 text-warning" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">23 Dec 2023</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Good campsite with nice nature. Staff was helpful and friendly.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">Reliable customer, always on time for check-in.</p>
                    <p className="text-xs text-muted-foreground mt-2">Added by Admin - 20 Jan 2024</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="Add internal notes about this customer..."
                  />
                  <Button size="sm">Add Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Stats
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="font-semibold text-primary">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spent</span>
                  <span className="font-medium">฿48,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Last Activity</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">Last Login</p>
                <p className="font-medium">Today, 09:30</p>
                <p className="text-muted-foreground mt-3">Last Booking</p>
                <p className="font-medium">15 Jan 2024</p>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Contact Channels</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Line
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
