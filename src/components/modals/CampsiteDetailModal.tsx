import { useState } from "react";
import { MapPin, Phone, Mail, TrendingUp, Calendar, Star, StickyNote, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CampsiteDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const CampsiteDetailModal = ({ open, onClose }: CampsiteDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[960px] max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold">Doi Suthep Campsite</h2>
                <Badge className="bg-success text-success-foreground">Open</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Chiang Mai
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  Khun Somchai
                </span>
                <span>081-234-5678</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  manager@doisuthep.com
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">Open</Button>
              <Button variant="outline" size="sm">Close</Button>
              <Button variant="outline" size="sm">Edit</Button>
              <Button variant="outline" size="sm">View on Map</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="zones">Zones / Spots</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Cover Image</p>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Description</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Beautiful mountain campsite with stunning views of Doi Suthep. Perfect for families and nature lovers. 
                    Features modern amenities including electricity, water, and clean facilities. Easy access from main road.
                  </p>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">WiFi</Badge>
                    <Badge variant="outline">Electricity</Badge>
                    <Badge variant="outline">Water</Badge>
                    <Badge variant="outline">Toilet</Badge>
                    <Badge variant="outline">Shower</Badge>
                    <Badge variant="outline">Parking</Badge>
                    <Badge variant="outline">BBQ Area</Badge>
                    <Badge variant="outline">Playground</Badge>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Rules</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Check-in: 14:00 / Check-out: 12:00</li>
                    <li>• No loud music after 22:00</li>
                    <li>• Pets allowed (on leash)</li>
                    <li>• No smoking in tent areas</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="zones" className="space-y-4 mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-semibold">Zone</th>
                        <th className="text-left p-3 font-semibold">Spots</th>
                        <th className="text-left p-3 font-semibold">Type</th>
                        <th className="text-left p-3 font-semibold">Price</th>
                        <th className="text-left p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3">Zone A - Mountain View</td>
                        <td className="p-3">15</td>
                        <td className="p-3">Standard</td>
                        <td className="p-3">฿1,500</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Zone B - Forest</td>
                        <td className="p-3">8</td>
                        <td className="p-3">Premium</td>
                        <td className="p-3">฿1,200</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">Active</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">Zone C - Riverside</td>
                        <td className="p-3">10</td>
                        <td className="p-3">Premium</td>
                        <td className="p-3">฿1,800</td>
                        <td className="p-3">
                          <Badge variant="outline">Seasonal</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Base Pricing</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekday Rate</span>
                      <span className="font-medium">฿1,200 - ฿1,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weekend Rate</span>
                      <span className="font-medium">฿1,500 - ฿2,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Holiday Rate</span>
                      <span className="font-medium">฿2,000 - ฿3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Extra Person Fee</span>
                      <span className="font-medium">฿250/person</span>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Seasonal Pricing</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">High Season</p>
                        <p className="text-xs text-muted-foreground">Nov - Feb</p>
                      </div>
                      <span className="font-medium text-primary">+30%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">Low Season</p>
                        <p className="text-xs text-muted-foreground">Jun - Aug</p>
                      </div>
                      <span className="font-medium text-success">-20%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Availability Calendar</h3>
                  <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">Calendar Component</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">Blackout Dates</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>Maintenance Period</span>
                      <span className="text-muted-foreground">15-20 May 2024</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-4">
                <div className="card-stat">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Overall Rating</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                          ))}
                        </div>
                        <span className="text-2xl font-bold">4.8</span>
                        <span className="text-muted-foreground">(127 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Somchai J.</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Amazing place with beautiful views! Clean facilities and friendly staff.
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Nittaya P.</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                          <Star className="w-3 h-3 text-warning" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 week ago</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Great campsite for families. Kids loved the playground!
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">Popular during high season, recommend early booking.</p>
                    <p className="text-xs text-muted-foreground mt-2">Added by Admin - 15 Jan 2024</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="Add internal notes about this campsite..."
                  />
                  <Button size="sm">Add Note</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">Manager Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Khun Somchai</p>
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
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Performance
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Occupancy Rate</span>
                  <span className="font-semibold text-primary">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue (MTD)</span>
                  <span className="font-medium">฿125,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Avg Rating</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Promotion
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <StickyNote className="w-4 h-4 mr-2" />
                  Add Blackout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
