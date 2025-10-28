import { useState } from "react";
import { Star, Phone, Mail, TrendingUp, MapPin, FileCheck, DollarSign, Activity, StickyNote } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface PartnerDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const PartnerDetailModal = ({ open, onClose }: PartnerDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Doi Suthep Campsite</h2>
                <Badge className="bg-success text-success-foreground">Active</Badge>
                <div className="flex items-center gap-1 px-2.5 py-0.5 bg-warning/10 text-warning rounded-full text-xs font-medium">
                  <Star className="w-3 h-3 fill-current" />
                  4.8
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Khun Somchai
                </span>
                <span>081-234-5678</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  partner@doisuthep.com
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Finance Report</Button>
              <Button variant="outline" size="sm">Suspend</Button>
              <Button variant="default" size="sm">Edit Profile</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="camps">Camps</TabsTrigger>
                <TabsTrigger value="kyc">KYC</TabsTrigger>
                <TabsTrigger value="payouts">Payouts</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4" />
                    Business Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Address:</span> 123 Doi Suthep Road, Chiang Mai 50200</p>
                    <p><span className="text-muted-foreground">Tax ID:</span> 0-1234-56789-01-2</p>
                    <p><span className="text-muted-foreground">Contact Person:</span> Khun Somchai Jaidee</p>
                    <p><span className="text-muted-foreground">Joined Date:</span> 15 March 2023</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Banking Details</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Bank:</span> Kasikorn Bank</p>
                    <p><span className="text-muted-foreground">Account Name:</span> Doi Suthep Campsite Co., Ltd.</p>
                    <p><span className="text-muted-foreground">Account Number:</span> 123-4-56789-0</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="camps" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Mountain View Zone</h4>
                        <p className="text-sm text-muted-foreground">15 spots available</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm">฿1,500/night</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">WiFi</Badge>
                      <Badge variant="outline" className="text-xs">Electricity</Badge>
                      <Badge variant="outline" className="text-xs">Water</Badge>
                      <Badge variant="outline" className="text-xs">Toilet</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">Forest Zone</h4>
                        <p className="text-sm text-muted-foreground">8 spots available</p>
                      </div>
                      <Badge>Active</Badge>
                    </div>
                    <p className="text-sm">฿1,200/night</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">Electricity</Badge>
                      <Badge variant="outline" className="text-xs">Water</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="kyc" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">National ID Card</p>
                        <p className="text-xs text-muted-foreground">Verified on 15 Mar 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Business Certificate</p>
                        <p className="text-xs text-muted-foreground">Verified on 15 Mar 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileCheck className="w-5 h-5 text-success" />
                      <div>
                        <p className="text-sm font-medium">Bank Statement</p>
                        <p className="text-xs text-muted-foreground">Verified on 15 Mar 2023</p>
                      </div>
                    </div>
                    <Badge className="bg-success text-success-foreground">Verified</Badge>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payouts" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">January 2024</p>
                      <p className="text-xs text-muted-foreground">15 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿45,000</p>
                      <Badge className="bg-success text-success-foreground">Paid</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">December 2023</p>
                      <p className="text-xs text-muted-foreground">22 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿66,000</p>
                      <Badge className="bg-success text-success-foreground">Paid</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                    <div>
                      <p className="text-sm font-medium">February 2024</p>
                      <p className="text-xs text-muted-foreground">18 bookings</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">฿54,000</p>
                      <Button size="sm" className="mt-1">Mark as Paid</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Updated Mountain View Zone pricing</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Payout completed for January</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-info mt-1.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">New review received (4.5 stars)</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">Excellent partner, always responsive and maintains high standards.</p>
                    <p className="text-xs text-muted-foreground mt-2">Added by Admin - 20 Jan 2024</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="Add internal notes about this partner..."
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
                Revenue Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total This Year</span>
                  <span className="font-semibold text-primary">฿540,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approval Rate</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Response</span>
                  <span className="font-medium">2 hours</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Contact Channels</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  081-234-5678
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Camps</span>
                  <span className="font-medium">2 zones</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span className="font-medium">187</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
