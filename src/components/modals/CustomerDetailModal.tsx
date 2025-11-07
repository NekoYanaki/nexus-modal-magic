import { useState } from "react";
import { User, Phone, Mail, CreditCard, Star, MessageSquare, TrendingUp, Download, Shield, Bell, AlertTriangle, Battery, Wifi } from "lucide-react";
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
                <h2 className="text-2xl font-semibold">คุณสมชาย ใจดี</h2>
                <Badge className="bg-success text-success-foreground">ใช้งานอยู่</Badge>
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
                <span>กรุงเทพมหานคร</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">ติดต่อ</Button>
              <Button variant="outline" size="sm">แบน</Button>
              <Button variant="outline" size="sm">ส่งออก</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="profile">ข้อมูล</TabsTrigger>
                <TabsTrigger value="bookings">การจอง</TabsTrigger>
                <TabsTrigger value="payments">การชำระเงิน</TabsTrigger>
                <TabsTrigger value="reviews">รีวิว</TabsTrigger>
                <TabsTrigger value="notifications">แจ้งเตือน & บริการ</TabsTrigger>
                <TabsTrigger value="notes">หมายเหตุ</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    ข้อมูลส่วนตัว
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="text-muted-foreground">ชื่อ-นามสกุล:</span> สมชาย ใจดี</p>
                    <p><span className="text-muted-foreground">อีเมล:</span> somchai@example.com</p>
                    <p><span className="text-muted-foreground">โทรศัพท์:</span> 081-234-5678</p>
                    <p><span className="text-muted-foreground">วันเกิด:</span> 15 มีนาคม 2533</p>
                    <p><span className="text-muted-foreground">บทบาท:</span> ลูกค้า</p>
                    <p><span className="text-muted-foreground">สมาชิกตั้งแต่:</span> 10 มกราคม 2566</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">ที่อยู่</h3>
                  <div className="space-y-2 text-sm">
                    <p>123/45 ถนนสุขุมวิท</p>
                    <p>คลองเตย กรุงเทพมหานคร 10110</p>
                    <p>ประเทศไทย</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">ข้อมูลระบุตัวตน</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <div>
                        <p><span className="text-muted-foreground">เลขบัตรประชาชน:</span> 1-2345-67890-12-3</p>
                        <Badge className="bg-success text-success-foreground mt-1">ยืนยันแล้ว</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        ดาวน์โหลด
                      </Button>
                    </div>
                    <div className="flex justify-between items-center mt-3">
                      <div>
                        <p><span className="text-muted-foreground">ใบขับขี่:</span> 12345678</p>
                        <Badge className="bg-success text-success-foreground mt-1">ยืนยันแล้ว</Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-3 h-3 mr-1" />
                        ดาวน์โหลด
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4 mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-semibold">รหัส</th>
                        <th className="text-left p-3 font-semibold">วันที่</th>
                        <th className="text-left p-3 font-semibold">รถ/แคมป์</th>
                        <th className="text-left p-3 font-semibold">สถานะ</th>
                        <th className="text-left p-3 font-semibold">ยอดรวม</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3">BK20240115</td>
                        <td className="p-3">15-17 ม.ค.</td>
                        <td className="p-3">แคมป์ดอยสุเทพ</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">ยืนยันแล้ว</Badge>
                        </td>
                        <td className="p-3 font-medium">฿4,500</td>
                      </tr>
                      <tr>
                        <td className="p-3">BK20231220</td>
                        <td className="p-3">20-22 ธ.ค.</td>
                        <td className="p-3">แคมป์เขาใหญ่</td>
                        <td className="p-3">
                          <Badge variant="outline">เสร็จสิ้น</Badge>
                        </td>
                        <td className="p-3 font-medium">฿3,800</td>
                      </tr>
                      <tr>
                        <td className="p-3">BK20231105</td>
                        <td className="p-3">5-7 พ.ย.</td>
                        <td className="p-3">รถบ้านเคลื่อนที่ • หัวหิน</td>
                        <td className="p-3">
                          <Badge variant="outline">เสร็จสิ้น</Badge>
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
                        <p className="text-xs text-muted-foreground">15 ม.ค. 2567, 10:45 น.</p>
                        <p className="text-xs text-muted-foreground">วิธีการ: บัตรเครดิต</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ยอดรวม: ฿4,500</p>
                      <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: ฿135</p>
                      <p className="font-semibold text-primary">สุทธิ: ฿4,365</p>
                      <Badge className="bg-success text-success-foreground mt-1">สำเร็จ</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TXN20231220001</p>
                        <p className="text-xs text-muted-foreground">20 ธ.ค. 2566, 14:20 น.</p>
                        <p className="text-xs text-muted-foreground">วิธีการ: โอนเงิน</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ยอดรวม: ฿3,800</p>
                      <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: ฿114</p>
                      <p className="font-semibold text-primary">สุทธิ: ฿3,686</p>
                      <Badge className="bg-success text-success-foreground mt-1">สำเร็จ</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">TXN20231105001</p>
                        <p className="text-xs text-muted-foreground">5 พ.ย. 2566, 09:15 น.</p>
                        <p className="text-xs text-muted-foreground">วิธีการ: บัตรเครดิต</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">ยอดรวม: ฿5,200</p>
                      <p className="text-xs text-muted-foreground">ค่าธรรมเนียม: ฿156</p>
                      <p className="font-semibold text-primary">สุทธิ: ฿5,044</p>
                      <Badge className="bg-success text-success-foreground mt-1">สำเร็จ</Badge>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">วิธีการชำระเงิน</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">•••• •••• •••• 1234</span>
                      </div>
                      <Badge variant="outline">ค่าเริ่มต้น</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">แคมป์ดอยสุเทพ</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">18 ม.ค. 2567</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      ประสบการณ์ที่น่าทึ่ง! ทิวทัศน์สวยงามและสิ่งอำนวยความสะดวกเยี่ยมยอด จะกลับมาอีกแน่นอน
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">แคมป์เขาใหญ่</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                          <Star className="w-3 h-3 text-warning" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">23 ธ.ค. 2566</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      แคมป์ปิ้งดีมีธรรมชาติสวยงาม เจ้าหน้าที่ช่วยเหลือดีและเป็นมิตร
                    </p>
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
                  <Button size="sm" variant="outline">คืนรถล่าช้า</Button>
                </div>

                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-info/10 flex items-center justify-center">
                          <Wifi className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Off-grid - แคมป์ดอยสุเทพ</p>
                          <p className="text-xs text-muted-foreground mt-1">การจอง: BK20240115 • รถ: กข 1234</p>
                          <p className="text-xs text-muted-foreground">5 ชั่วโมงที่แล้ว</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">แก้ไขแล้ว</Badge>
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
                          <p className="text-xs text-muted-foreground mt-1">การจอง: BK20231220 • รถ: ขค 5678</p>
                          <p className="text-xs text-muted-foreground">2 วันที่แล้ว</p>
                        </div>
                      </div>
                      <Badge className="bg-success text-success-foreground">แก้ไขแล้ว</Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">ลูกค้าที่เชื่อถือได้ เช็คอินตรงเวลาเสมอ</p>
                    <p className="text-xs text-muted-foreground mt-2">เพิ่มโดย Admin - 20 ม.ค. 2567</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="เพิ่มหมายเหตุภายในเกี่ยวกับลูกค้านี้..."
                  />
                  <Button size="sm">เพิ่มหมายเหตุ</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                สถิติย่อ
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">การจองทั้งหมด</span>
                  <span className="font-semibold text-primary">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ยอดใช้จ่ายรวม</span>
                  <span className="font-medium">฿48,500</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เรตติ้งเฉลี่ย</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">กิจกรรมล่าสุด</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">เข้าสู่ระบบล่าสุด</p>
                <p className="font-medium">วันนี้, 09:30 น.</p>
                <p className="text-muted-foreground mt-3">การจองล่าสุด</p>
                <p className="font-medium">15 ม.ค. 2567</p>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">โปรโมชั่น</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">รหัสส่วนลด:</p>
                <Badge variant="outline" className="font-mono">SUMMER2024</Badge>
                <p className="text-xs text-muted-foreground mt-1">ลด 10% สำหรับการจองครั้งถัดไป</p>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                ความปลอดภัย
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  ตั้งค่าข้อความส่วนตัว
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  รีเซ็ตรหัสผ่าน
                </Button>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">ช่องทางติดต่อ</h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  โทร
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  อีเมล
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