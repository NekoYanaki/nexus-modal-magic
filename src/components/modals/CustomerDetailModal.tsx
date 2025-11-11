import { User, Phone, Mail, Star, TrendingUp, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface CustomerDetailModalProps {
  open: boolean;
  onClose: () => void;
}

export const CustomerDetailModal = ({ open, onClose }: CustomerDetailModalProps) => {
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
            <h3 className="text-lg font-semibold">ข้อมูล</h3>

            {/* ข้อมูลส่วนตัว Card */}
            <Card className="p-4">
              <h4 className="font-semibold flex items-center gap-2 mb-4">
                <User className="w-4 h-4" />
                ข้อมูลส่วนตัว
              </h4>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">ชื่อ-นามสกุล</span>
                  <p className="font-medium mt-1">สมชาย ใจดี</p>
                </div>
                <div>
                  <span className="text-muted-foreground">อีเมล</span>
                  <p className="font-medium mt-1">somchai@example.com</p>
                </div>
                <div>
                  <span className="text-muted-foreground">เบอร์โทรศัพท์</span>
                  <p className="font-medium mt-1">081-234-5678</p>
                </div>
                <div>
                  <span className="text-muted-foreground">บทบาท</span>
                  <p className="font-medium mt-1">ลูกค้า</p>
                </div>
                <div>
                  <span className="text-muted-foreground">สมาชิกตั้งแต่</span>
                  <p className="font-medium mt-1">10 มกราคม 2566</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-4">แก้ไขข้อมูล</Button>
            </Card>

            {/* ความปลอดภัย Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-4">ความปลอดภัย</h4>
              <Button variant="outline" size="sm">เปลี่ยนรหัสผ่าน</Button>
            </Card>

            {/* เอกสารประกอบ Card */}
            <Card className="p-4">
              <h4 className="font-semibold mb-4">เอกสารประกอบ</h4>
              <div className="space-y-4">
                {/* บัตรประชาชน */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">บัตรประชาชน</span>
                    <span className="text-xs text-muted-foreground">1/1</span>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <div className="w-full h-48 bg-muted rounded flex items-center justify-center mb-2">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        ดูรูปภาพ
                      </Button>
                    </div>
                  </div>
                </div>

                {/* ใบขับขี่ */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">ใบขับขี่</span>
                    <span className="text-xs text-muted-foreground">1/1</span>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-4 flex items-center justify-center bg-muted/30">
                    <div className="text-center">
                      <div className="w-full h-48 bg-muted rounded flex items-center justify-center mb-2">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <Button variant="outline" size="sm">
                        <ImageIcon className="w-3 h-3 mr-1" />
                        ดูรูปภาพ
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Sidebar - 1/3 */}
          <div className="space-y-4">
            {/* สถิติย่อ */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3">สถิติย่อ</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">การจองทั้งหมด</p>
                  <p className="text-2xl font-bold text-primary">12</p>
                </div>
                <div>
                  <p className="text-muted-foreground">ค่าใช้จ่ายทั้งหมด</p>
                  <p className="text-2xl font-bold text-success">฿48.5k</p>
                </div>
                <div>
                  <p className="text-muted-foreground">คะแนนเฉลี่ย</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 fill-warning text-warning" />
                    <span className="text-lg font-bold">4.8</span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground">กิจกรรมล่าสุด</p>
                  <p className="text-xs font-medium mt-1">2 ชั่วโมงที่แล้ว</p>
                </div>
              </div>
            </Card>

            {/* กิจกรรมล่าสุด */}
            <Card className="p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                กิจกรรมล่าสุด
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2 pb-2 border-b">
                  <div className="w-2 h-2 rounded-full bg-success mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-medium">เข้าสู่ระบบ</p>
                    <p className="text-xs text-muted-foreground">2 ชั่วโมงที่แล้ว</p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pb-2 border-b">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-medium">ยืนยันการจอง BK002</p>
                    <p className="text-xs text-muted-foreground">15 มีนาคม 2567</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-muted mt-1.5"></div>
                  <div className="flex-1">
                    <p className="font-medium">อัพเดทโปรไฟล์</p>
                    <p className="text-xs text-muted-foreground">10 มีนาคม 2567</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
