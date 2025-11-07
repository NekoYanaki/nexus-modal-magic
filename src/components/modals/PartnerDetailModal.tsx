import { useState } from "react";
import { Star, Phone, Mail, TrendingUp, MapPin, FileCheck, DollarSign, Activity, StickyNote, Bell, AlertTriangle, Battery, Wifi, Car, Tent, BarChart3 } from "lucide-react";
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
                  คุณสมชาย
                </span>
                <span>081-234-5678</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  partner@doisuthep.com
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">รายงานการเงิน</Button>
              <Button variant="outline" size="sm">ระงับ</Button>
              <Button variant="default" size="sm">แก้ไขโปรไฟล์</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="profile">ข้อมูล</TabsTrigger>
                <TabsTrigger value="camps">แคมป์</TabsTrigger>
                <TabsTrigger value="income">รายได้ & สถิติ</TabsTrigger>
                <TabsTrigger value="notifications">แจ้งเตือน & บริการ</TabsTrigger>
                <TabsTrigger value="payouts">การจ่ายเงิน</TabsTrigger>
                <TabsTrigger value="activity">กิจกรรม & หมายเหตุ</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4" />
                    ข้อมูลธุรกิจ
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">ที่อยู่:</span> 123 ถนนดอยสุเทพ เชียงใหม่ 50200</p>
                    <p><span className="text-muted-foreground">เลขประจำตัวผู้เสียภาษี:</span> 0-1234-56789-01-2</p>
                    <p><span className="text-muted-foreground">ผู้ติดต่อ:</span> คุณสมชาย ใจดี</p>
                    <p><span className="text-muted-foreground">โทรศัพท์:</span> 081-234-5678</p>
                    <p><span className="text-muted-foreground">อีเมล:</span> partner@doisuthep.com</p>
                    <p><span className="text-muted-foreground">วันที่เข้าร่วม:</span> 15 มีนาคม 2566</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">รายละเอียดธนาคาร</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">ธนาคาร:</span> ธนาคารกสิกรไทย</p>
                    <p><span className="text-muted-foreground">ชื่อบัญชี:</span> บริษัท ดอยสุเทพ แคมป์ไซต์ จำกัด</p>
                    <p><span className="text-muted-foreground">เลขที่บัญชี:</span> 123-4-56789-0</p>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm">บันทึก</Button>
                    <Button variant="outline" size="sm">ยกเลิก</Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="camps" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">โซนวิวภูเขา</h4>
                        <p className="text-sm text-muted-foreground">15 จุด • เชียงใหม่</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">เปิด</Badge>
                    </div>
                    <p className="text-sm">฿1,500/คืน</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">WiFi</Badge>
                      <Badge variant="outline" className="text-xs">ไฟฟ้า</Badge>
                      <Badge variant="outline" className="text-xs">น้ำ</Badge>
                      <Badge variant="outline" className="text-xs">ห้องน้ำ</Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">ดูแคมป์</Button>
                      <Button size="sm" variant="outline">ปิดใช้งาน</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">โซนป่า</h4>
                        <p className="text-sm text-muted-foreground">8 จุด • เชียงใหม่</p>
                      </div>
                      <Badge className="bg-success text-success-foreground">เปิด</Badge>
                    </div>
                    <p className="text-sm">฿1,200/คืน</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">ไฟฟ้า</Badge>
                      <Badge variant="outline" className="text-xs">น้ำ</Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" variant="outline">ดูแคมป์</Button>
                      <Button size="sm" variant="outline">ปิดใช้งาน</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="income" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="card-stat">
                    <p className="text-xs text-muted-foreground mb-1">รายได้เดือนนี้</p>
                    <p className="text-2xl font-bold text-primary">฿125,000</p>
                    <p className="text-xs text-success mt-1">+12% จากเดือนที่แล้ว</p>
                  </div>
                  <div className="card-stat">
                    <p className="text-xs text-muted-foreground mb-1">รายได้ปีนี้</p>
                    <p className="text-2xl font-bold">฿540,000</p>
                  </div>
                  <div className="card-stat">
                    <p className="text-xs text-muted-foreground mb-1">อัตราการยอมรับ</p>
                    <p className="text-2xl font-bold">98%</p>
                  </div>
                  <div className="card-stat">
                    <p className="text-xs text-muted-foreground mb-1">อัตราการเข้าพัก</p>
                    <p className="text-2xl font-bold">78%</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    แยกตามสถานที่</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">โซนวิวภูเขา</p>
                        <p className="text-xs text-muted-foreground">45 การจอง</p>
                      </div>
                      <span className="font-semibold text-primary">฿67,500</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">โซนป่า</p>
                        <p className="text-xs text-muted-foreground">32 การจอง</p>
                      </div>
                      <span className="font-semibold text-primary">฿38,400</span>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    แยกตามรถ</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">รถบ้านเคลื่อนที่</p>
                        <p className="text-xs text-muted-foreground">18 การจอง</p>
                      </div>
                      <span className="font-semibold">฿54,000</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="text-sm font-medium">รถตู้แคมป์</p>
                        <p className="text-xs text-muted-foreground">25 การจอง</p>
                      </div>
                      <span className="font-semibold">฿75,000</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 mt-4">
                <div className="flex gap-2 flex-wrap mb-4">
                  <Button size="sm" variant="outline">ทั้งหมด</Button>
                  <Button size="sm" variant="outline">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    อุบัติเหตุ
                  </Button>
                  <Button size="sm" variant="outline">
                    <Wifi className="w-3 h-3 mr-1" />
                    Off-grid
                  </Button>
                  <Button size="sm" variant="outline">
                    <Battery className="w-3 h-3 mr-1" />
                    แบตเตอรี่ต่ำ
                  </Button>
                  <Button size="sm" variant="outline">
                    <Bell className="w-3 h-3 mr-1" />
                    ระบบ
                  </Button>
                  <Button size="sm" variant="outline">คืนรถล่าช้า</Button>
                </div>

                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">อุบัติเหตุเล็กน้อย - โซนวิวภูเขา</p>
                          <p className="text-xs text-muted-foreground mt-1">ลูกค้า: คุณสมชาย • รถ: กข 1234</p>
                          <p className="text-xs text-muted-foreground">2 ชั่วโมงที่แล้ว</p>
                        </div>
                      </div>
                      <Badge variant="outline">รอดำเนินการ</Badge>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Button size="sm">ทำเครื่องหมายว่าแก้ไขแล้ว</Button>
                      <Button size="sm" variant="outline">ตอบกลับ</Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center">
                          <Battery className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">แบตเตอรี่ต่ำ - รถบ้านเคลื่อนที่</p>
                          <p className="text-xs text-muted-foreground mt-1">ลูกค้า: คุณนิตยา • รถ: ขค 5678</p>
                          <p className="text-xs text-muted-foreground">5 ชั่วโมงที่แล้ว</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">แก้ไขแล้ว</Badge>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Off-grid - โซนป่า</p>
                          <p className="text-xs text-muted-foreground mt-1">ลูกค้า: คุณประยุทธ์ • รถ: งจ 9012</p>
                          <p className="text-xs text-muted-foreground">1 วันที่แล้ว</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">แก้ไขแล้ว</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="payouts" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">มกราคม 2567</p>
                      <p className="text-xs text-muted-foreground">15 การจอง</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">฿45,000</p>
                      <p className="text-xs text-muted-foreground">ส่วนลด: ฿2,250</p>
                      <p className="font-bold text-primary">฿42,750</p>
                      <Badge className="bg-success text-success-foreground mt-1">จ่ายแล้ว</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">ธันวาคม 2566</p>
                      <p className="text-xs text-muted-foreground">22 การจอง</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">฿66,000</p>
                      <p className="text-xs text-muted-foreground">ส่วนลด: ฿3,300</p>
                      <p className="font-bold text-primary">฿62,700</p>
                      <Badge className="bg-success text-success-foreground mt-1">จ่ายแล้ว</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg bg-primary/5">
                    <div>
                      <p className="text-sm font-medium">กุมภาพันธ์ 2567</p>
                      <p className="text-xs text-muted-foreground">18 การจอง</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm">฿54,000</p>
                      <p className="text-xs text-muted-foreground">ส่วนลด: ฿2,700</p>
                      <p className="font-bold text-primary">฿51,300</p>
                      <Button size="sm" className="mt-1">ทำเครื่องหมายว่าจ่ายแล้ว</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4 mt-4">
                <div className="card-stat mb-4">
                  <h3 className="font-semibold mb-3">กิจกรรม</h3>
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">อัปเดตราคาโซนวิวภูเขา</p>
                        <p className="text-xs text-muted-foreground">2 ชั่วโมงที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-success mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">จ่ายเงินเดือนมกราคมเรียบร้อยแล้ว</p>
                        <p className="text-xs text-muted-foreground">1 วันที่แล้ว</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-info mt-1.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">ได้รับรีวิวใหม่ (4.5 ดาว)</p>
                        <p className="text-xs text-muted-foreground">3 วันที่แล้ว</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">หมายเหตุ (ภายใน)</h3>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <p className="text-sm">พาร์ทเนอร์ที่ดีเยี่ยม ตอบกลับเร็วและรักษามาตรฐานสูงเสมอ</p>
                      <p className="text-xs text-muted-foreground mt-2">เพิ่มโดย Admin - 20 ม.ค. 2567</p>
                    </div>
                    <textarea
                      className="w-full p-3 border rounded-lg text-sm resize-none"
                      rows={4}
                      placeholder="เพิ่มหมายเหตุภายในเกี่ยวกับพาร์ทเนอร์นี้..."
                    />
                    <Button size="sm">เพิ่มหมายเหตุ</Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                สรุปรายได้
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รายได้รวมปีนี้</span>
                  <span className="font-semibold text-primary">฿540,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รายได้เดือนนี้</span>
                  <span className="font-semibold text-primary">฿125,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">อัตราการยอมรับ</span>
                  <span className="font-medium">98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เวลาตอบกลับเฉลี่ย</span>
                  <span className="font-medium">2 ชั่วโมง</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">ช่องทางติดต่อ</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  081-234-5678
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  อีเมล
                </Button>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">สถิติย่อ</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">แคมป์</span>
                  <span className="font-medium">2 โซน</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">จำนวนจุด</span>
                  <span className="font-medium">23 จุด</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เรตติ้งเฉลี่ย</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">การจองทั้งหมด</span>
                  <span className="font-medium">187</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">การดำเนินการด่วน</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  ส่งการแจ้งเตือน
                </Button>
                <Button variant="destructive" size="sm" className="w-full justify-start">
                  ระงับพาร์ทเนอร์
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
