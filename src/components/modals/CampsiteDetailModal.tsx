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
                <h2 className="text-2xl font-semibold">แคมป์ดอยสุเทพ</h2>
                <Badge className="bg-success text-success-foreground">เปิด</Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  เชียงใหม่
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  คุณสมชาย
                </span>
                <span>081-234-5678</span>
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  manager@doisuthep.com
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="default" size="sm">เปิดใช้งาน</Button>
              <Button variant="outline" size="sm">ปิดใช้งาน</Button>
              <Button variant="outline" size="sm">แก้ไข</Button>
              <Button variant="outline" size="sm">ดูแผนที่</Button>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Main Content - 2/3 */}
          <div className="col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview">ภาพรวม</TabsTrigger>
                <TabsTrigger value="zones">โซน / จุดพัก</TabsTrigger>
                <TabsTrigger value="pricing">ราคา</TabsTrigger>
                <TabsTrigger value="calendar">ปฏิทิน</TabsTrigger>
                <TabsTrigger value="reviews">รีวิว</TabsTrigger>
                <TabsTrigger value="notes">หมายเหตุ</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">รูปภาพหน้าปก</p>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">คำอธิบาย</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    แคมป์ปิ้งบนภูเขาที่สวยงามพร้อมวิวดอยสุเทพที่สวยงาม เหมาะสำหรับครอบครัวและคนรักธรรมชาติ 
                    มีสิ่งอำนวยความสะดวกทันสมัย รวมทั้งไฟฟ้า น้ำ และสิ่งอำนวยความสะดวกที่สะอาด เข้าถึงได้ง่ายจากถนนหลัก
                  </p>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">สิ่งอำนวยความสะดวก</h3>
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline">WiFi</Badge>
                    <Badge variant="outline">ไฟฟ้า</Badge>
                    <Badge variant="outline">น้ำ</Badge>
                    <Badge variant="outline">ห้องน้ำ</Badge>
                    <Badge variant="outline">ฝักบัว</Badge>
                    <Badge variant="outline">ที่จอดรถ</Badge>
                    <Badge variant="outline">พื้นที่ย่างบาร์บีคิว</Badge>
                    <Badge variant="outline">สนามเด็กเล่น</Badge>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">กฎระเบียบ</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• เช็คอิน: 14:00 / เช็คเอาท์: 12:00</li>
                    <li>• ห้ามเปิดเพลงดังหลัง 22:00 น.</li>
                    <li>• อนุญาตให้นำสัตว์เลี้ยงมาได้ (ต้องจูงสายจูง)</li>
                    <li>• ห้ามสูบบุหรี่ในบริเวณเต็นท์</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="zones" className="space-y-4 mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary">
                      <tr>
                        <th className="text-left p-3 font-semibold">โซน</th>
                        <th className="text-left p-3 font-semibold">จำนวนจุด</th>
                        <th className="text-left p-3 font-semibold">ประเภท</th>
                        <th className="text-left p-3 font-semibold">ราคา</th>
                        <th className="text-left p-3 font-semibold">สถานะ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-3">โซน A - วิวภูเขา</td>
                        <td className="p-3">15</td>
                        <td className="p-3">มาตรฐาน</td>
                        <td className="p-3">฿1,500</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">เปิด</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">โซน B - ป่า</td>
                        <td className="p-3">8</td>
                        <td className="p-3">พรีเมียม</td>
                        <td className="p-3">฿1,200</td>
                        <td className="p-3">
                          <Badge className="bg-success text-success-foreground">เปิด</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-3">โซน C - ริมแม่น้ำ</td>
                        <td className="p-3">10</td>
                        <td className="p-3">พรีเมียม</td>
                        <td className="p-3">฿1,800</td>
                        <td className="p-3">
                          <Badge variant="outline">ตามฤดูกาล</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="pricing" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold mb-3">ราคาพื้นฐาน</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ราคาวันธรรมดา</span>
                      <span className="font-medium">฿1,200 - ฿1,800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ราคาวันเสาร์-อาทิตย์</span>
                      <span className="font-medium">฿1,500 - ฿2,200</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ราคาวันหยุดนักขัตฤกษ์</span>
                      <span className="font-medium">฿2,000 - ฿3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">ค่าบริการคนเพิ่ม</span>
                      <span className="font-medium">฿250/คน</span>
                    </div>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">ราคาตามฤดูกาล</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">ฤดูท่องเที่ยว</p>
                        <p className="text-xs text-muted-foreground">พ.ย. - ก.พ.</p>
                      </div>
                      <span className="font-medium text-primary">+30%</span>
                    </div>
                    <div className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <p className="font-medium">ฤดูฝน</p>
                        <p className="text-xs text-muted-foreground">มิ.ย. - ส.ค.</p>
                      </div>
                      <span className="font-medium text-success">-20%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4 mt-4">
                <div className="card-stat">
                  <h3 className="font-semibold mb-3">ปฏิทินความพร้อม</h3>
                  <div className="aspect-square bg-secondary/30 rounded-lg flex items-center justify-center">
                    <p className="text-muted-foreground">คอมโพเนนต์ปฏิทิน</p>
                  </div>
                </div>

                <div className="card-stat">
                  <h3 className="font-semibold mb-3">วันที่ปิดให้บริการ</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 border rounded">
                      <span>ระยะเวลาซ่อมบำรุง</span>
                      <span className="text-muted-foreground">15-20 พ.ค. 2567</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4 mt-4">
                <div className="card-stat">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">คะแนนรวม</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                          ))}
                        </div>
                        <span className="text-2xl font-bold">4.8</span>
                        <span className="text-muted-foreground">(127 รีวิว)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">คุณสมชาย จ.</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">2 วันที่แล้ว</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      สถานที่ที่น่าทึ่งด้วยทิวทัศน์ที่สวยงาม! สิ่งอำนวยความสะดวกสะอาดและเจ้าหน้าที่เป็นมิตร
                    </p>
                  </div>

                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">คุณนิตยา พ.</span>
                        <div className="flex">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="w-3 h-3 fill-warning text-warning" />
                          ))}
                          <Star className="w-3 h-3 text-warning" />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">1 สัปดาห์ที่แล้ว</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      แคมป์ปิ้งที่ดีสำหรับครอบครัว เด็กๆ ชอบสนามเด็กเล่นมาก!
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm">เป็นที่นิยมในช่วงฤดูท่องเที่ยว แนะนำให้จองล่วงหน้า</p>
                    <p className="text-xs text-muted-foreground mt-2">เพิ่มโดย Admin - 15 ม.ค. 2567</p>
                  </div>
                  <textarea
                    className="w-full p-3 border rounded-lg text-sm resize-none"
                    rows={4}
                    placeholder="เพิ่มหมายเหตุภายในเกี่ยวกับแคมป์ปิ้งนี้..."
                  />
                  <Button size="sm">เพิ่มหมายเหตุ</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="space-y-4">
            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3">ผู้จัดการติดต่อ</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">คุณสมชาย</p>
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
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                ประสิทธิภาพ
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">อัตราการเข้าพัก</span>
                  <span className="font-semibold text-primary">78%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">รายได้ (เดือนนี้)</span>
                  <span className="font-medium">฿125,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">เรตติ้งเฉลี่ย</span>
                  <span className="font-medium">4.8/5.0</span>
                </div>
              </div>
            </div>

            <div className="card-stat">
              <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                การดำเนินการด่วน
              </h3>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  สร้างโปรโมชั่น
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <StickyNote className="w-4 h-4 mr-2" />
                  เพิ่มวันปิดให้บริการ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};